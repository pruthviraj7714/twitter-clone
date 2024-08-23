import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "User not found!" }, { status: 403 });
  }

  const postId = req.nextUrl.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { message: "Post Id not found!" },
      { status: 400 }
    );
  }

  try {
    const userId = Number(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, postId },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });

      return NextResponse.json(
        { message: "Post successfully removed from Bookmark!" },
        { status: 200 }
      );
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });

      return NextResponse.json(
        { message: "Bookmarked Post successfully!" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
