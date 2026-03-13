import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { bill: { select: { id: true, title: true } } },
    });

    const data = payments.map((p) => ({
      id: p.id,
      billId: p.billId,
      billTitle: p.bill.title,
      amount: Number(p.amount),
      status: p.status,
      reference: p.reference,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Payments GET", e);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
