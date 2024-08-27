import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { profileSchema } from "@/schema/schemas";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "User not found!",
      },
      { status: 404 }
    );
  }

  try {
    const parsedBody = profileSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      const errors = parsedBody.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          message: "Invalid Inputs",
          errors,
        },
        { status: 403 }
      );
    }

    const { name, bio, photo, headerPhoto } = parsedBody.data;

    const updateData: any = { name, bio };

    if (photo) {
      updateData.photo = photo;
    }

    if (headerPhoto) {
      updateData.headerPhoto = headerPhoto;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(session.user.id),
      },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "User updated successfully!",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
