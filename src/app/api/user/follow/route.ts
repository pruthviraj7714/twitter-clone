import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User Not Authenticated!" },
        { status: 403 }
      );
    }

    const { followUser }: { followUser: string } = await req.json();

    if (!followUser) {
      return NextResponse.json(
        { message: "User Not found!" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 }
      );
    }

    const user2 = await prisma.user.findUnique({
      where: { username: followUser },
    });

    if (!user2) {
      return NextResponse.json(
        { message: "User not found!" },
        { status: 404 }
      );
    }

    const isFollowed = await prisma.follow.findFirst({
      where: {
        followerId: user2.id,
        followingId: Number(session.user.id),
      },
    });

    if (!isFollowed) {
      await prisma.follow.create({
        data: {
          followerId: user2.id,
          followingId: Number(session.user.id),
        },
      });
      return NextResponse.json(
        { message: "User Successfully Following Other User" },
        { status: 200 }
      );
    } else {
      await prisma.follow.delete({
        where: { id: isFollowed.id },
      });
      return NextResponse.json(
        { message: "User Successfully Unfollowed Other User" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error handling follow/unfollow:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
