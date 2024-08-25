import authOptions from "@/lib/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        message: "Unauthorized User",
      },
      { status: 403 }
    );
  }

  try {
    const postId = req.nextUrl.searchParams.get("postId");

    if(!postId) {
        return NextResponse.json({
            message : "Post Not found!"
        }, { status : 400})
    }
    
    const post = await prisma.post.findUnique({
      where : {
        id : postId
      },
      include : {
        user : {
            select : {
                username : true,
                photo : true
            }
        },
        likes :  true,
        bookmark : true,
        comments : {
          orderBy : {
            createdAt : "desc"
          },
          include : {
            user : {
              select : {
                username : true,
                photo : true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      post
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
