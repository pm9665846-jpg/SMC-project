import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        department: { select: { name: true } },
      },
    });

    const data = projects.map((p) => ({
      id: p.id,
      name: p.name,
      departmentId: p.departmentId,
      departmentName: p.department?.name,
      status: p.status,
      progress: p.progress,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Projects GET", e);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
