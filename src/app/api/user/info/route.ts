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

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(session.user.id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        name : true,
        followers: true,
        followings: true,
        headerPhoto: true,
        bio: true,
        likes: true,
        bookmarks : {
          select : {
            postId : true
          }
        },
        comments: true,
        photo: true,
        notificationsAsUser : {
          orderBy : {
            createdAt : "desc"
          },
          include : {
            follower : true,
            post : true,
            liker : true,
            replier : true,
            comment : true
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
