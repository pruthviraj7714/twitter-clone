"use client";
import { Bookmark, Dot, Ellipsis, Reply, Share, Trash2 } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "./ui/use-toast";

export default function PostBox({ id }: { id: string }) {
  const router = useRouter();
  const session = useSession();
  const [postInfo, setPostInfo] = useState<any>({});
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { toast } = useToast();
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setIsLoading] = useState<boolean>(true);

  const now = new Date();
  const createdAt = postInfo?.createdAt || now;
  const seconds = Math.floor(
    (now.getTime() - new Date(createdAt).getTime()) / 1000
  );

  let relativeTime;
  if (seconds < 60) {
    relativeTime = `${seconds}s`;
  } else if (seconds < 3600) {
    relativeTime = `${Math.floor(seconds / 60)}m`;
  } else if (seconds < 86400) {
    relativeTime = `${Math.floor(seconds / 3600)}h`;
  } else if (seconds < 604800) {
    relativeTime = `${Math.floor(seconds / 86400)}d`;
  } else if (new Date(createdAt).getFullYear() === now.getFullYear()) {
    relativeTime = format(new Date(createdAt), "MMM d");
  } else {
    relativeTime = format(new Date(createdAt), "yyyy");
  }

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/post/like?postId=${id}`, {});
      setIsLiked(!isLiked);
      toast({
        title: res.data.message,
      });
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const getPostInfo = async () => {
    try {
      const res = await axios.get(`/api/post/info?postId=${id}`);
      setPostInfo(res.data.post);
      setIsLiked(
        res.data.post.likes?.some(
          (l: any) => l.userId === Number(session.data?.user?.id)
        )
      );
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/delete?postId=${id}`);
      setIsDeleted(true);
      router.refresh()
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getPostInfo();
  }, [isLiked]);

  if (loading) {
    return (
      <div className="p-4 border-b border-gray-700 animate-pulse">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-600 mr-4"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-600 rounded w-1/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-600 rounded mb-2"></div>
        <div className="h-6 bg-gray-600 rounded mb-2"></div>
        <div className="h-6 bg-gray-600 rounded mb-2"></div>
        <div className="h-40 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const { username, photo } = postInfo?.user;

  return (
    <div className="w-full flex flex-col p-4 border-b border-gray-700 hover:bg-white/5 transition-colors duration-200">
      <div className="flex justify-between mb-2">
        <div
          className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
          onClick={() => router.push(`/${username}`)}
        >
          {photo ? (
            <img
              src={photo}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-white text-xl">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-start items-center mb-1">
            <span
              onClick={() => router.push(`/${username}`)}
              className="font-semibold text-white cursor-pointer hover:underline"
            >
              {username}
            </span>
            <span className="ml-2 text-gray-400">@{username}</span>
            <span className="text-gray-400">
              <Dot size={15} />
            </span>
            <span className="text-gray-400 text-sm">{relativeTime}</span>
          </div>
          <div className="mb-3 font-normal text-md text-slate-200">
            {postInfo.text}
          </div>
          {postInfo.image && (
            <div className="mb-3">
              <img
                src={postInfo.image}
                alt="Post Image"
                className="w-full h-auto rounded-xl object-cover shadow-md"
              />
            </div>
          )}
          {postInfo.video && (
            <div className="mb-3">
              <video controls className="w-full h-auto rounded-xl shadow-md">
                <source src={postInfo.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-center items-center text-gray-600 cursor-pointer hover:text-sky-600 hover:bg-sky-600/20 p-1 w-8 h-8 rounded-full">
              <Ellipsis size={20} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 bg-black hover:bg-black text-white text-lg">
            <DropdownMenuItem
              onClick={handleDeletePost}
              className="hover:bg-pink-400"
            >
              <div className="flex gap-1.5 font-semibold text-red-500 ">
                <Trash2 size={20} />
                <span>Delete</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between items-center px-2 text-gray-400">
        <span
          onClick={handleLike}
          className="cursor-pointer flex items-center transition-colors duration-150 hover:text-pink-500"
        >
          {isLiked ? (
            <FaHeart
              className="text-pink-500 hover:rounded-full p-1"
              size={25}
            />
          ) : (
            <FaRegHeart
              className="hover:bg-pink-600/30 hover:rounded-full p-1"
              size={25}
            />
          )}
          <span>{postInfo.likes?.length || 0}</span>
        </span>
        <span className="cursor-pointer flex items-center transition-colors duration-150 hover:text-sky-500">
          <Reply
            className="hover:bg-sky-600/30 hover:rounded-full p-1"
            size={25}
          />
          <span>{postInfo.comments?.length || 0}</span>
        </span>
        <span className="cursor-pointer transition-colors duration-150 hover:text-sky-500">
          <Share
            className="hover:bg-sky-600/30 hover:rounded-full p-1"
            size={25}
          />
        </span>
        <span className="cursor-pointer transition-colors duration-150 hover:text-sky-500">
          <Bookmark
            className="hover:bg-sky-600/30 hover:rounded-full p-1"
            size={25}
          />
        </span>
      </div>
    </div>
  );
}
