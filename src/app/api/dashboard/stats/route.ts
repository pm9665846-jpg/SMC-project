import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [openComplaints, activeProjects, pendingBills, resolvedCount, totalComplaints] =
      await Promise.all([
        prisma.complaint.count({
          where: {
            status: { in: ["submitted", "assigned", "in_progress"] },
          },
        }),
        prisma.project.count({ where: { status: "active" } }),
        prisma.bill.count({ where: { status: "pending" } }),
        prisma.complaint.count({ where: { status: "resolved" } }),
        prisma.complaint.count(),
      ]);

    const resolutionRate =
      totalComplaints > 0
        ? Math.round((resolvedCount / totalComplaints) * 100)
        : 0;

    return NextResponse.json({
      openComplaints,
      activeProjects,
      pendingBills,
      resolutionRate,
      totalComplaints,
      resolvedCount,
    });
  } catch (e) {
    console.error("Dashboard stats GET", e);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
