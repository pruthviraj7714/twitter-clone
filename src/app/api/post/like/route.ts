import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "User not found!",
      },
      { status: 403 }
    );
  }

  const postId = req.nextUrl.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      {
        message: "Post Id not found!",
      },
      { status: 400 }
    );
  }

  try {
    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          message: "Post not found!",
        },
        { status: 400 }
      );
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json(
        {
          message: "Post unliked successfully!",
        },
        { status: 200 }
      );
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      await prisma.notification.create({
        data: {
          userId: Number(post.userId),
          likerId: Number(session.user.id),
          postId,
          type: "LIKE",
        },
      });
      return NextResponse.json(
        {
          message: "Post liked successfully!",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error handling like/unlike:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
