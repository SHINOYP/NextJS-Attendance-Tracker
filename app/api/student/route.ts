// app/api/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server.helper";
import prisma from "@/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bycrpt from "bcrypt";

// Get all students
export async function GET() {
  try {
    await connectToDatabase();

    // Only fetch users with STUDENT role
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT", // Ensure "STUDENT" matches the enum or type definition in your schema
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong: Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Create a new student
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session || session?.user?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized: Only coaches can add students" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const student = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: password ? await bycrpt.hash(password, 10) : null,
        role: "STUDENT", // Ensure "STUDENT" matches the enum or type definition in your schema
      },
    });

    return NextResponse.json(
      {
        message: "Student created successfully",
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: student.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong: Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update a student
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = session?.user; // Adjusted to access the correct session structure
    interface data {
      role: string;
    }
    if (!session || data?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized: Only coaches can update students" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, email } = body;

    if (!id || (!name && !email)) {
      return NextResponse.json(
        { error: "Student ID and at least one field to update are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
    }

    const updatedStudent = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Student updated successfully",
        student: updatedStudent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong: Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a student
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const data = session?.user; // Adjusted to access the correct session structure

    if (!session || data?.role !== "COACH") {
      return NextResponse.json(
        { error: "Unauthorized: Only coaches can delete students" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Student deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong: Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
