"use client";

import { useFetch } from "@/hooks/use-fetch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Search,
  FilePlus,
  LayoutDashboard,
  Calendar,
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react";
import { AnimatedNumber } from "@/components/public/AnimatedNumber";
import { HeroSlider } from "@/components/public/HeroSlider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PublicHomePage() {
  const { data: stats, isLoading } = useFetch<{
    totalComplaints: number;
    completedWorks: number;
    pendingIssues: number;
    resolutionRate: number;
    transparencyScore: number;
  }>("/api/public/stats");

  const statCards = [
    {
      label: "Total Complaints",
      value: stats?.totalComplaints ?? 0,
      icon: MessageSquareWarning,
      color: "text-blue-600",
    },
    {
      label: "Completed Works",
      value: stats?.completedWorks ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
    {
      label: "Pending Issues",
      value: stats?.pendingIssues ?? 0,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Transparency Score",
      value: stats?.transparencyScore ?? 0,
      suffix: "%",
      icon: Eye,
      color: "text-violet-600",
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Hero — full-screen slider background */}
      <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-28 min-h-[calc(100vh-84px)] flex items-center overflow-hidden bg-black">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Fallback dark background */}
          <div className="absolute inset-0 bg-black" />

          {/* Hero slider */}
          <HeroSlider mode="background" className="h-full w-full" />

          {/* Dark overlay - FIXED (removed to-background/90) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />

          {/* Optional subtle bottom dark fade instead of white fog */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
            Government transparency portal
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl text-white">
            Smart Municipal{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              Complaint & Control
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base md:text-lg text-white/80 leading-relaxed">
            Track complaints, view meetings, and raise issues with full transparency.
            No login required.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="gap-2 rounded-xl bg-primary px-6 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/track">
                <Search className="h-4 w-4" />
                Track Complaint
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 rounded-xl border-2 border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/30"
            >
              <Link href="/raise-complaint">
                <FilePlus className="h-4 w-4" />
                Raise Complaint
              </Link>
            </Button>

            <Button
              size="lg"
              variant="secondary"
              asChild
              className="gap-2 rounded-xl bg-black/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/35"
            >
              <Link href="/transparency">
                <LayoutDashboard className="h-4 w-4" />
                Transparency
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live stats — colored accent cards */}
      <section className="relative px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <motion.p
            className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Live transparency stats
          </motion.p>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={container}
            initial="hidden"
            animate={isLoading ? "hidden" : "show"}
            viewport={{ once: true }}
          >
            {statCards.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} variants={item} className="group">
                  <Card className="h-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/20">
                    <div
                      className={`h-1 w-full bg-gradient-to-r ${
                        s.label === "Total Complaints"
                          ? "from-blue-500 to-blue-400"
                          : s.label === "Completed Works"
                          ? "from-emerald-500 to-emerald-400"
                          : s.label === "Pending Issues"
                          ? "from-amber-500 to-amber-400"
                          : "from-violet-500 to-violet-400"
                      }`}
                    />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {s.label}
                      </CardTitle>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted transition group-hover:scale-110 ${s.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold tabular-nums md:text-3xl ${s.color}`}
                      >
                        <AnimatedNumber value={s.value} suffix={s.suffix ?? ""} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* What you can do — feature cards */}
      <section className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container relative mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80 mb-3">
              Citizen services
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              What you can do
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground text-sm md:text-base">
              No login needed. Track, submit, or view public information anytime.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {[
              {
                title: "Track by ID",
                desc: "Search by complaint ID and see status: Pending, In Progress, Meeting Scheduled, or Completed.",
                href: "/track",
                icon: Search,
                cta: "Track Complaint",
                accent: "from-blue-500 to-cyan-500",
                iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                primary: false,
              },
              {
                title: "Raise complaint",
                desc: "Submit with OTP verification. Add title, description, location, and images — no account required.",
                href: "/raise-complaint",
                icon: FilePlus,
                cta: "Raise Complaint",
                accent: "from-primary to-cyan-500",
                iconBg: "bg-primary/15 text-primary",
                primary: true,
              },
              {
                title: "Public meetings",
                desc: "View meeting summaries, work progress, and approval status in read-only transparency mode.",
                href: "/meetings",
                icon: Calendar,
                cta: "View Meetings",
                accent: "from-violet-500 to-primary",
                iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                primary: false,
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.href} variants={item}>
                  <Link
                    href={f.href}
                    className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-2xl"
                  >
                    <Card className="h-full rounded-2xl border border-border/60 bg-card/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/25 hover:-translate-y-1.5">
                      <div className={`h-1.5 w-full bg-gradient-to-r ${f.accent}`} />
                      <CardHeader className="pb-4 pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.iconBg} transition-transform duration-300 group-hover:scale-105`}
                          >
                            <Icon className="h-6 w-6" />
                          </span>
                          <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground mt-4 leading-tight">
                          {f.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground mt-1.5">
                          {f.desc}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span
                          className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
                            f.primary
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30"
                              : "border-2 border-border bg-muted/30 text-foreground hover:border-primary/30 hover:bg-primary/5"
                          }`}
                        >
                          {f.cta}
                          <ArrowRight className="h-4 w-4 opacity-70" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}