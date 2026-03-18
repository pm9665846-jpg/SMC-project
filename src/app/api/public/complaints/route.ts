import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      priority,
      submittedBy,
      location,
      attachmentUrls,
    } = body;

    const complaint = await prisma.complaint.create({
      data: {
        title: title ?? "Untitled",
        description: description ?? "",
        category: category ?? "Other",
        priority: priority ?? "medium",
        submittedBy: submittedBy ?? "guest",
        location: location ?? undefined,
      },
    });

    if (Array.isArray(attachmentUrls) && attachmentUrls.length > 0) {
      await prisma.complaintAttachment.createMany({
        data: attachmentUrls.slice(0, 5).map((url: string) => ({
          complaintId: complaint.id,
          fileUrl: url,
        })),
      });
    }

    return NextResponse.json({
      id: complaint.id,
      title: complaint.title,
      status: complaint.status,
      message: "Complaint submitted. Save this ID to track: " + complaint.id,
    });
  } catch (e) {
    console.error("Public complaint POST", e);
    return NextResponse.json(
      { error: "Failed to submit complaint" },
      { status: 500 }
    );
  }
}
