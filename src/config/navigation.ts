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
  Home,
  Sparkles,
  Megaphone,
  Images,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  children?: { title: string; href: string }[];
}

const STAFF_ROLES: UserRole[] = ["admin", "department_head", "staff", "auditor"];
const PUBLIC_ONLY: UserRole[] = ["public"];

export const SIDEBAR_NAV: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Schemes",
    href: "/schemes",
    icon: Sparkles,
    roles: PUBLIC_ONLY,
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    children: [
      { title: "My Complaints", href: "/complaints" },
      { title: "Submit New", href: "/complaints/submit" },
    ],
  },
  {
    title: "Notices",
    href: "/notices",
    icon: Megaphone,
    roles: PUBLIC_ONLY,
  },
  {
    title: "Work & Projects",
    href: "/projects",
    icon: Briefcase,
    roles: STAFF_ROLES,
  },
  {
    title: "Meetings",
    href: "/meetings",
    icon: Calendar,
    roles: STAFF_ROLES,
    children: [
      { title: "Schedule", href: "/meetings" },
      { title: "Discussions", href: "/meetings/discussions" },
    ],
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    roles: STAFF_ROLES,
  },
  {
    title: "Bills & Approval",
    href: "/bills",
    icon: FileText,
    roles: STAFF_ROLES,
    children: [
      { title: "Submit Bill", href: "/bills/submit" },
      { title: "Approvals", href: "/bills/approvals" },
    ],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
    roles: STAFF_ROLES,
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
    roles: STAFF_ROLES,
  },
  {
    title: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
    roles: STAFF_ROLES,
  },
  {
    title: "Audit Trail",
    href: "/audit",
    icon: FileCheck,
    roles: ["admin", "auditor"],
  },
  {
    title: "Homepage Slider",
    href: "/hero-slider",
    icon: Images,
    roles: ["admin"],
  },
  {
    title: "Public Portal",
    href: "/",
    icon: Home,
  },
];

export function getNavForRole(role: UserRole): NavItem[] {
  return SIDEBAR_NAV.filter((item) => !item.roles || item.roles.includes(role));
}
