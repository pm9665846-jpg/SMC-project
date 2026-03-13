import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");

    const tasks = await prisma.task.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(assigneeId ? { assigneeId } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      include: {
        assignee: { select: { name: true } },
        project: { select: { name: true } },
      },
    });

    const data = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assigneeId: t.assigneeId,
      assigneeName: t.assignee?.name,
      dueDate: t.dueDate?.toISOString().slice(0, 10),
      projectId: t.projectId,
      projectName: t.project?.name,
      sortOrder: t.sortOrder,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Tasks GET", e);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Task id required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: { ...(status && { status }) },
    });

    return NextResponse.json({
      id: task.id,
      status: task.status,
      updatedAt: task.updatedAt.toISOString(),
    });
  } catch (e) {
    console.error("Tasks PATCH", e);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
