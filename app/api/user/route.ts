import { NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server.helper";
import prisma from "@/prisma";

export const GET = async () => {
  try {
    await connectToDatabase();
    const users = await prisma.user.findMany();
    return NextResponse.json({ users }, { status: 200 });
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
