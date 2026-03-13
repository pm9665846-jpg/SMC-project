import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        department: { select: { name: true } },
        assignee: { select: { name: true, email: true } },
        attachments: true,
      },
    });

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority,
      submittedBy: complaint.submittedBy,
      assignedTo: complaint.assignedTo,
      assigneeName: complaint.assignee?.name,
      departmentId: complaint.departmentId,
      departmentName: complaint.department?.name,
      location: complaint.location,
      attachments: complaint.attachments.map((a) => a.fileUrl),
      createdAt: complaint.createdAt.toISOString(),
      updatedAt: complaint.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error("Complaint GET", e);
    return NextResponse.json(
      { error: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...(body.status != null && { status: body.status }),
        ...(body.assignedTo != null && { assignedTo: body.assignedTo }),
        ...(body.departmentId != null && { departmentId: body.departmentId }),
      },
    });

    return NextResponse.json({
      id: complaint.id,
      status: complaint.status,
      assignedTo: complaint.assignedTo,
      updatedAt: complaint.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error("Complaint PATCH", e);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
