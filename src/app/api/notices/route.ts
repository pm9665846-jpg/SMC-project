import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { publishedAt: "desc" },
    });

    const data = notices.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      publishedAt: n.publishedAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Notices GET", e);
    return NextResponse.json(
      { error: "Failed to fetch notices" },
      { status: 500 }
    );
  }
}
