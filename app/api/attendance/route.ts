import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";

// API to mark attendance for a session in bulk
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session?.user?.role !== "COACH" && session?.user?.role !== "CAPTAIN")
  ) {
    return NextResponse.json(
      { error: "Unauthorized: Only coaches or captains can mark attendance" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { attendances } = body;

    if (attendances.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: sessionId and attendances array required" },
        { status: 400 }
      );
    }

    // Prepare attendance records for bulk creation
    interface AttendanceEntry {
      studentId: string;
      status: string;
    }

    // Define the Status type
    type Status = "PRESENT" | "ABSENT";

    const attendanceData = attendances.map((entry: AttendanceEntry) => ({
      studentId: entry.studentId,
      status: (entry.status as Status) || ("PRESENT" as Status),
      markedById: session.user.id,
    }));
    console.log(attendanceData);
    // Insert all attendance records at once
    await prisma.attendance.createMany({
      data: attendanceData,
    });

    return NextResponse.json(
      { message: "Attendance marked successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error marking attendance:", err);
    return NextResponse.json(
      { error: "Something went wrong while marking attendance" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get date from query parameters
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

    // Make sure the date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Set up start and end of the day for date comparison
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Count attendance records for that day
    const attendanceCount = await prisma.attendance.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return NextResponse.json({
      date: dateStr,
      attendanceMarked: attendanceCount > 0,
      count: attendanceCount,
    });
  } catch (error) {
    console.error("Error checking attendance:", error);
    return NextResponse.json(
      { error: "Failed to check attendance" },
      { status: 500 }
    );
  }
}
