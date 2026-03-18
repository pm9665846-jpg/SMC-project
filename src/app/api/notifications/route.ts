import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const all = searchParams.get("all") === "true";

    if (!userId && !all) {
      return NextResponse.json(
        { error: "userId or all=true required" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        ...(all ? {} : { userId: userId! }),
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: all ? 100 : 50,
      include: all ? { user: { select: { name: true } } } : undefined,
    });

    const data = notifications.map((n) => {
      const base = {
        id: n.id,
        title: n.title,
        body: n.body,
        type: n.type,
        readAt: n.readAt?.toISOString() ?? null,
        entityType: n.entityType,
        entityId: n.entityId,
        createdAt: n.createdAt.toISOString(),
      };
      if (all && "user" in n && n.user) {
        return { ...base, userName: (n as typeof n & { user: { name: string } }).user.name };
      }
      return base;
    });

    return NextResponse.json(data);
  } catch (e) {
    console.error("Notifications GET", e);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
