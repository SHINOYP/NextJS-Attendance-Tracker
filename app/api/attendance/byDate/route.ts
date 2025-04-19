// app/api/attendance/byDate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  try {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get attendance records for the specified date
    const records = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        studentId: true,
        status: true,
        student: {
          select: {
            name: true,
            rollNumber: true,
            Category: true,
          },
        },
      },
    });

    return NextResponse.json({
      date: dateStr,
      attendanceMarked: records.length > 0,
      records: records.map((record) => ({
        id: record.id,
        studentId: record.studentId,
        status: record.status,
        studentName: record.student.name,
        rollNumber: record.student.rollNumber?.toString(),
        category: record.student.Category,
      })),
    });
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance details" },
      { status: 500 }
    );
  }
}
