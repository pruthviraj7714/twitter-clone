import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User Not Authenticated!" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        photo: true,
        bio: true,
        followers: true,
        followings: true,
      },
    });

    if (!users) {
      return NextResponse.json(
        {
          message: "No Users Found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error handling follow/unfollow:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
