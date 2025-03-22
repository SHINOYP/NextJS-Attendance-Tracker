import { NextResponse } from "next/server";
import { connectToDatabase } from "@/helpers/server.helper";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";

export const GET = async () => {
  try {
    const session = await getServerSession();
    console.log(session, "session");
    await connectToDatabase();
    const category = await prisma.category.findMany();
    return NextResponse.json({ category }, { status: 200 });
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
