import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "User Not Found!",
      },
      { status: 403 }
    );
  }

  const username = req.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      {
        message: "No Username Found",
      },
      { status: 404 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        name : true,
        email: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: true,
        followings: true,
        headerPhoto: true,
        bio: true,
        likes: true,
        bookmarks: true,
        comments: true,
        photo: true,
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

    return NextResponse.json(user, { status: 200 });
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
