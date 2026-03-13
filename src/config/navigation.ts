import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Briefcase,
  Calendar,
  CheckSquare,
  FileText,
  CreditCard,
  Building2,
  Users,
  Bell,
  BarChart3,
  FileCheck,
  UserCircle,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  children?: { title: string; href: string }[];
}

export const SIDEBAR_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    children: [
      { title: "All Complaints", href: "/complaints" },
      { title: "Submit New", href: "/complaints/submit" },
    ],
  },
  {
    title: "Work & Projects",
    href: "/projects",
    icon: Briefcase,
  },
  {
    title: "Meetings",
    href: "/meetings",
    icon: Calendar,
    children: [
      { title: "Schedule", href: "/meetings" },
      { title: "Discussions", href: "/meetings/discussions" },
    ],
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Bills & Approval",
    href: "/bills",
    icon: FileText,
    children: [
      { title: "Submit Bill", href: "/bills/submit" },
      { title: "Approvals", href: "/bills/approvals" },
    ],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Departments",
    href: "/departments",
    icon: Building2,
    roles: ["admin", "department_head"],
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Users,
    roles: ["admin", "department_head"],
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Audit Trail",
    href: "/audit",
    icon: FileCheck,
    roles: ["admin", "auditor"],
  },
];

export function getNavForRole(role: UserRole): NavItem[] {
  return SIDEBAR_NAV.filter((item) => !item.roles || item.roles.includes(role));
}
