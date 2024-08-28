"use client";
import {  Dot, Ellipsis, Share, Trash2 } from "lucide-react";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { RWebShare } from "react-web-share";

export default function PostBox({
  id,
  bookmarks,
}: {
  id: string;
  bookmarks: any[];
}) {
  const router = useRouter();
  const session = useSession();
  const [postInfo, setPostInfo] = useState<any>({});
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

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

  const getPostInfo = async () => {
    try {
      const res = await axios.get(`/api/post/info?postId=${id}`);
      setPostInfo(res.data.post);

      setIsLiked(
        res.data.post.likes?.some(
          (l: any) => l.userId === Number(session.data?.user?.id)
        )
      );
      setBookmarked(bookmarks.some((l: any) => l.postId === id));
    } catch (error: any) {
      toast({
        title: error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (e: any) => {
    e.stopPropagation();
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

  const handleBookmark = async (e: any) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/post/bookmark?postId=${id}`, {});
      setBookmarked(!bookmarked);
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

  const handleDeletePost = async (e: any) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/post/delete?postId=${id}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const handleShare = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
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
    <div
      onClick={(e: any) => {
        e.stopPropagation();
        router.push(`/${username}/${id}`);
      }}
      className="w-full flex flex-col p-4 border-b border-gray-700 hover:bg-white/5 transition-colors duration-200"
    >
      <div className="flex justify-between mb-2">
        <div
          className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
          onClick={(e: any) => {
            e.stopPropagation();
            router.push(`/${username}`);
          }}
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
              onClick={(e: any) => {
                e.stopPropagation();
                router.push(`/${username}`);
              }}
              className="font-semibold text-white cursor-pointer hover:underline"
            >
              {postInfo?.user?.name}
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
          <DropdownMenuContent className="w-44 outline-none bg-black hover:bg-white/5">
            <div
              onClick={handleDeletePost}
              className="bg-black hover:bg-white/5 cursor-pointer text-white text-md p-2"
            >
              <div className="flex gap-1.5 font-semibold text-red-500 ">
                <Trash2 size={20} />
                <span>Delete</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between items-center px-2 text-gray-400">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
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
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 text-white">
              <p>Like</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-pointer flex items-center transition-colors duration-150 hover:text-sky-500">
                <FaRegComment
                  className="hover:bg-sky-600/30 hover:rounded-full p-1"
                  size={25}
                />
                <span>{postInfo.comments?.length || 0}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 text-white">
              <p>Reply</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div onClick={handleShare}>
                <RWebShare
                  data={{
                    text: "Like humans, flamingos make friends for life",
                    url: "https://web.whatsapp.com",
                    title: "Share with friends & family",
                  }}
                >
                  <span className="cursor-pointer transition-colors duration-150 hover:text-sky-500">
                    <Share
                      className="hover:bg-sky-600/30 hover:rounded-full p-1"
                      size={25}
                    />
                  </span>
                </RWebShare>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 text-white">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span
                onClick={handleBookmark}
                className="cursor-pointer transition-colors duration-150 hover:text-sky-500"
              >
                {bookmarked ? (
                  <FaBookmark
                    className="text-sky-500 rounded-full p-1"
                    size={25}
                  />
                ) : (
                  <FaRegBookmark
                    className="hover:bg-sky-600/30 rounded-full p-1"
                    size={25}
                  />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 text-white">
              <p>Bookmark</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
