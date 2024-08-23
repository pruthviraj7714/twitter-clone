import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({
            message: "User not found!"
        }, { status: 403 });
    }

    try {
        const body = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                id: Number(session.user.id)
            }
        });

        if (!user) {
            return NextResponse.json({
                message: "User not found!"
            }, { status: 403 });
        }

        const data: any = {
            userId: user.id,
            text: body.text,
        };

        if (body.image) data.image = body.image;
        if (body.video) data.video = body.video;

        const post = await prisma.post.create({
            data
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                posts: {
                    connect: { id: post.id }
                }
            }
        });

        return NextResponse.json({
            message: "Post created successfully!",
            post
        }, { status: 201 });

    } catch (error : any) {
        return NextResponse.json({
            message: "An error occurred!",
            error: error.message
        }, { status: 500 });
    }
}
