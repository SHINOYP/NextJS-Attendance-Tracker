import prisma from "@/prisma";

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
  } catch (e) {
    console.log(e);
    throw new Error("unable to connect to database");
  }
};
