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

    const notificationId = req.nextUrl.searchParams.get("id");

    if (!notificationId || isNaN(Number(notificationId))) {
        return NextResponse.json(
          {
            message: "Invalid or missing notification ID!",
          },
          { status: 400 }
        );
      }

    await prisma.notification.update({
      where: {
        id: Number(notificationId),
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
        message : "Notification Read Successfully!"
    }, { status : 200})
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
