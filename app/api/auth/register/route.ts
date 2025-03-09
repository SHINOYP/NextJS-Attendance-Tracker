import { NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server.helper";
import prisma from "@/prisma";
import bycrpt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Please fill all fields" },
        { status: 400 }
      );
    }
    const hashedPassword = await bycrpt.hash(password, 10);
    await connectToDatabase();
    const newuser = await prisma.user.create({
      data: { name, email, hashedPassword },
    });
    return NextResponse.json({ newuser }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went Wrong : Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
