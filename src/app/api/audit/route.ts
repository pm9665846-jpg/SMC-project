import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const logs = await prisma.auditLog.findMany({
      where: q
        ? {
            OR: [
              { action: { contains: q } },
              { userEmail: { contains: q } },
              { entityType: { contains: q } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const data = logs.map((l) => ({
      id: l.id,
      action: l.action,
      userId: l.userId,
      userEmail: l.userEmail,
      entityType: l.entityType,
      entityId: l.entityId,
      metadata: l.metadata,
      createdAt: l.createdAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Audit GET", e);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
