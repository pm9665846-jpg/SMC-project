"use client";

import { useAuth } from "@/providers/auth-provider";
import { DashboardAdmin } from "@/components/dashboard/dashboard-admin";
import { DashboardDepartmentHead } from "@/components/dashboard/dashboard-department-head";
import { DashboardStaff } from "@/components/dashboard/dashboard-staff";
import { DashboardAuditor } from "@/components/dashboard/dashboard-auditor";
import { DashboardPublic } from "@/components/dashboard/dashboard-public";

export default function DashboardPage() {
  const { role } = useAuth();

  switch (role) {
    case "admin":
      return <DashboardAdmin />;
    case "department_head":
      return <DashboardDepartmentHead />;
    case "staff":
      return <DashboardStaff />;
    case "auditor":
      return <DashboardAuditor />;
    default:
      return <DashboardPublic />;
  }
}
