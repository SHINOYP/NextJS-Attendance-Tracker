import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const startDateStr = searchParams.get("start");
  const endDateStr = searchParams.get("end");
  const team = searchParams.get("team");

  if (!startDateStr || !endDateStr) {
    return NextResponse.json(
      { error: "Start and end date parameters are required" },
      { status: 400 }
    );
  }

  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Set to beginning of start day and end of end day
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Find all attendance records in the date range
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        student:
          team !== "All"
            ? {
                Category: team,
              }
            : undefined,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNumber: true,
            Category: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get all unique dates in the range with records
    const uniqueDates = [
      ...new Set(
        attendanceRecords.map((record) => {
          const date = new Date(record.date);
          return date.toISOString().split("T")[0]; // YYYY-MM-DD format
        })
      ),
    ];

    // Group records by date
    const recordsByDate = uniqueDates.map((date) => {
      const dayRecords = attendanceRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.toISOString().split("T")[0] === date;
      });

      return {
        date,
        records: dayRecords.map((record) => ({
          id: record.id,
          studentId: record.studentId,
          status: record.status,
          studentName: record.student.name,
          rollNumber: record.student.rollNumber?.toString(),
          category: record.student.Category,
        })),
      };
    });

    return NextResponse.json({
      dateRange: { startDate: startDateStr, endDate: endDateStr },
      team,
      dates: recordsByDate,
    });
  } catch (error) {
    console.error("Error fetching attendance range:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance range" },
      { status: 500 }
    );
  }
}
