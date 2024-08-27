import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized User",
        },
        { status: 403 }
      );
    }

    const commentId = req.nextUrl.searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        {
          message: "No Comment ID found!",
        },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
        userId: Number(session.user.id),
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          message: "You are not authorized to delete this comment!",
        },
        { status: 400 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(
      {
        message: "Comment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
