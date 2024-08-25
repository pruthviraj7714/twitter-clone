import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const { postId, text } = await req.json();

    if (!postId) {
      return NextResponse.json({
        message: "No PostId found!",
      }, { status: 400 });
    }
    
    const comment = await prisma.comment.create({
      data: {
        userId: Number(session.user.id),
        postId,
        text,
      },
    });

    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
