import prisma from "@/lib/db";
import { signUpSchema } from "@/schema/schemas";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const parsedBody = signUpSchema.safeParse(await req.json());

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

    const { name, username, email, password } = parsedBody.data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "User already exists with this email or username",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
