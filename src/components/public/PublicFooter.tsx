"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = [
  { label: "Track Complaint", href: "/track" },
  { label: "Transparency", href: "/transparency" },
  { label: "Meetings", href: "/meetings" },
  { label: "Notices", href: "/notices" },
  { label: "Staff Login", href: "/login" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: Facebook,
    color: "text-blue-600",
    hoverBg: "hover:bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
    color: "text-sky-500",
    hoverBg: "hover:bg-sky-500/10",
    hoverBorder: "hover:border-sky-500/30",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: Instagram,
    color: "text-pink-500",
    hoverBg: "hover:bg-pink-500/10",
    hoverBorder: "hover:border-pink-500/30",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
    color: "text-blue-700",
    hoverBg: "hover:bg-blue-700/10",
    hoverBorder: "hover:border-blue-700/30",
  },
];

export function PublicFooter() {
  return (
    <footer className="relative border-t border-border/50 bg-muted/30 mt-auto overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Follow us</h3>

            {/* Colorful Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon, color, hoverBg, hoverBorder }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-background/60 backdrop-blur-sm transition-all duration-300 hover:scale-110 ${color} ${hoverBg} ${hoverBorder}`}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mt-4">
              Smart Municipal Complaint & Meeting Control — transparency and citizen services.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick links</h3>
            <ul className="space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Citizen services</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track complaints, view meetings, and raise issues without login. Full transparency.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SMC. Government transparency portal.
          </p>
          <p className="text-xs text-muted-foreground">
            No login required for tracking and submission.
          </p>
        </div>
      </div>
    </footer>
  );
}