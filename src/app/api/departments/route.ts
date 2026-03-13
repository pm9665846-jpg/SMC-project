import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        head: { select: { id: true, name: true, email: true } },
        _count: { select: { users: true } },
      },
    });

    const data = departments.map((d) => ({
      id: d.id,
      name: d.name,
      headId: d.headId,
      headName: d.head?.name,
      staffCount: d._count.users,
      createdAt: d.createdAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Departments GET", e);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
