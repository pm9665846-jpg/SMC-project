import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: [{ meetingDate: "asc" }, { meetingTime: "asc" }],
      include: {
        department: { select: { name: true } },
        participants: { include: { user: { select: { name: true } } } },
      },
    });

    const formatTime = (d: Date) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    const data = meetings.map((m) => ({
      id: m.id,
      title: m.title,
      agenda: m.agenda,
      date: m.meetingDate.toISOString().slice(0, 10),
      time: formatTime(m.meetingTime),
      status: m.status,
      departmentId: m.departmentId,
      departmentName: m.department?.name,
      participants: m.participants.length,
      participantNames: m.participants.map((p) => p.user.name),
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("Meetings GET", e);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, agenda, meetingDate, meetingTime, departmentId, participantIds } = body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const dateStr = typeof meetingDate === "string" ? meetingDate.trim() : "";
    const timeStr = typeof meetingTime === "string" ? meetingTime.trim() : "09:00";
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: "Valid meeting date (YYYY-MM-DD) is required" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr + "T00:00:00");
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid meeting date" },
        { status: 400 }
      );
    }

    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    const hours = timeMatch ? parseInt(timeMatch[1], 10) : 9;
    const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
    const timeDate = new Date(1970, 0, 1, hours, minutes, 0, 0);

    const meeting = await prisma.meeting.create({
      data: {
        title: title.trim(),
        agenda: agenda && String(agenda).trim() ? String(agenda).trim() : null,
        meetingDate: date,
        meetingTime: timeDate,
        departmentId: departmentId && String(departmentId).trim() ? String(departmentId).trim() : null,
        status: "scheduled",
        ...(Array.isArray(participantIds) && participantIds.length > 0
          ? {
              participants: {
                create: participantIds
                  .filter((id: unknown) => typeof id === "string" && id.trim())
                  .map((userId: string) => ({ userId: userId.trim() })),
              },
            }
          : {}),
      },
      include: {
        department: { select: { name: true } },
        participants: { include: { user: { select: { name: true } } } },
      },
    });

    const formatTime = (d: Date) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    return NextResponse.json({
      id: meeting.id,
      title: meeting.title,
      agenda: meeting.agenda,
      date: meeting.meetingDate.toISOString().slice(0, 10),
      time: formatTime(meeting.meetingTime),
      status: meeting.status,
      departmentId: meeting.departmentId,
      departmentName: meeting.department?.name,
      participants: meeting.participants.length,
      participantNames: meeting.participants.map((p) => p.user.name),
      createdAt: meeting.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("Meetings POST", e);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
