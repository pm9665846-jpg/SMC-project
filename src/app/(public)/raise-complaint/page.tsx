"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2, Upload, X, FilePlus } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";

const CATEGORIES = [
  "Street Light",
  "Sanitation",
  "Water",
  "Roads",
  "Drainage",
  "Other",
];
const PRIORITIES = ["low", "medium", "high"];

export default function RaiseComplaintPage() {
  const [step, setStep] = useState<"contact" | "otp" | "form">("contact");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const [submitResult, setSubmitResult] = useState<{ id: string } | null>(null);

  const sendOtp = async () => {
    const value = phoneOrEmail.trim();
    if (!value) {
      setError("Enter phone or email");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send OTP");
        return;
      }
      setOtpSent(true);
      setStep("otp");
      if (data.devOtp) setOtp(data.devOtp);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("Enter OTP");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneOrEmail: phoneOrEmail.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Invalid OTP");
        return;
      }
      setVerified(true);
      setStep("form");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setUploadUrls((prev) => prev.filter((_, idx) => idx !== i));
  };

  const uploadFiles = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (res.ok && data.url) urls.push(data.url);
    }
    return urls;
  };

  const submitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const urls = await uploadFiles();
      const res = await fetch("/api/public/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled",
          description,
          category,
          priority,
          submittedBy: phoneOrEmail.trim(),
          location: location || undefined,
          attachmentUrls: urls,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit");
        return;
      }
      setSubmitResult({ id: data.id });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (submitResult) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-xl">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <CardContent className="pt-10 pb-10 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <h2 className="text-xl font-bold mb-2">Complaint submitted</h2>
              <p className="text-muted-foreground mb-4">Save this ID to track your complaint:</p>
              <p className="font-mono text-lg font-bold text-primary mb-8 rounded-xl bg-primary/10 px-4 py-3 inline-block">{submitResult.id}</p>
              <Button asChild className="rounded-xl">
                <Link href="/track">Track complaint</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <PageHero
        title="Raise complaint (no login)"
        description="Verify with OTP, then submit title, description, location, and optional images."
        icon={FilePlus}
      />

      <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-primary to-cyan-500" />
        <CardHeader>
          <CardTitle>
            {step === "contact" && "Step 1: Contact"}
            {step === "otp" && "Step 2: Verify OTP"}
            {step === "form" && "Step 3: Complaint details"}
          </CardTitle>
          <CardDescription>
            {step === "contact" && "Enter phone or email to receive OTP"}
            {step === "otp" && "Enter the 6-digit code sent to you"}
            {step === "form" && "Fill in the complaint details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
          )}

          <AnimatePresence mode="wait">
            {step === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <Label>Phone or Email</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 9876543210 or email@example.com"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={sendOtp} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div>
                  <Label>OTP</Label>
                  <Input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="mt-1"
                  />
                </div>
                <Button onClick={verifyOtp} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("contact")}>
                  Change number/email
                </Button>
              </motion.div>
            )}

            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
                onSubmit={submitComplaint}
              >
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue"
                    className="mt-1 w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <Label>Location (address or area)</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Block A, Main Road"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Images (optional, max 5)</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <label className="cursor-pointer rounded-lg border border-dashed px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
                      <Upload className="inline h-4 w-4 mr-2" />
                      Add image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                      />
                    </label>
                    {files.map((f, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs"
                      >
                        {f.name.slice(0, 15)}…
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-destructive hover:bg-destructive/10 rounded p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit complaint"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
