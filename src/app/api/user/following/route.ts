import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "User Not Authenticated!",
      },
      { status: 403 }
    );
  }

  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          message: "Username Not Found!",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        followings: {
          include : {
            follower : true
          }
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User Not Found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Success",
      followings: user.followings,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
