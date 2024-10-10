"use client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft, Dot, Ellipsis, Reply, Share, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserInfo } from "@/hooks/user";
import { Button } from "@/components/ui/button";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import CommentBox from "@/components/CommentBox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RWebShare } from "react-web-share";
export default function PostPage({
  params,
}: {
  params: {
    username: string;
    postId: string;
  };
}) {
  const router = useRouter();
  const { username, postId } = params;
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const { userInfo, isLoading } = useUserInfo();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [postInfo, setPostInfo] = useState<any>({});
  const { toast } = useToast();
  const [uploading, setUploading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const getPostInfo = async () => {
    try {
      const res = await axios.get(`/api/post/info?postId=${postId}`);
      setPostInfo(res.data.post);
      setIsLiked(
        res.data.post.likes?.some(
          (l: any) => l.userId === Number(session?.user?.id)
        )
      );
    } catch (error: any) {
      toast({
        title: error?.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e: any) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`/api/post/like?postId=${postId}`, {});
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
      const res = await axios.post(`/api/post/bookmark?postId=${postId}`, {});
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

  const handleReply = async () => {
    setUploading(true);
    try {
      await axios.post("/api/post/comment/create", {
        postId,
        text,
      });
      setText("");
      router.refresh();
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePost = async (e: any) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/post/delete?postId=${params.postId}`);
      router.push('/home')
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getPostInfo();
    if (!isLoading && userInfo) {
      setBookmarked(userInfo?.bookmarks?.some((l: any) => l.postId === postId));
    }
  }, [userInfo, isLoading, postId]);

  if (isLoading || loading) {
    return (
      <div className="flex flex-col w-full border-l border-r border-white/15 min-h-screen animate-pulse mt-10">
        <div className="flex justify-between mb-2 w-full p-3">
          <div className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden"></div>
          <div className="flex-1">
            <div className="flex flex-col justify-start mb-1">
              <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
              <div className="h-4 bg-gray-500 rounded w-24"></div>
            </div>
            <div className="mb-3 mt-1.5 font-normal text-md">
              <div className="h-6 bg-gray-600 rounded w-full"></div>
              <div className="h-6 bg-gray-600 rounded w-full mt-2"></div>
              <div className="h-6 bg-gray-600 rounded w-full mt-2"></div>
            </div>

            <div className="text-white/55 text-sm">
              <div className="h-4 bg-gray-500 rounded w-28"></div>
            </div>
          </div>
        </div>
        <div className="border border-white/15 w-full"></div>
        <div className="flex justify-between items-center px-2 my-2 text-gray-400">
          <div className="cursor-pointer flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
          <div className="cursor-pointer flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
          <div className="cursor-pointer">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
          <div className="cursor-pointer flex items-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>
        <div className="border border-white/15 w-full"></div>
        <div className="flex gap-3 px-2 py-2 mt-2.5">
          <div className="h-12 w-12 rounded-full bg-gray-600"></div>
          <div className="bg-gray-600 h-8 rounded w-full"></div>
        </div>
        <div className="flex gap-2 justify-end items-center mb-3 mr-3">
          <div className="rounded-full bg-gray-600 h-10 w-20"></div>
        </div>
        <div className="border w-full border-white/15"></div>
        <div className="w-full flex flex-col gap-4 p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-500 rounded w-full"></div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-500 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full border-l border-r border-white/15 min-h-screen">
      <div className="h-16 bg-black flex justify-start items-center">
        <div className="flex items-center">
          <ArrowLeft
            className="ml-1.5 cursor-pointer"
            size={20}
            onClick={() => {
              router.back()
            }}
          />
        </div>
        <div className="ml-6 text-md">
          <h1 className="text-lg font-bold">Post</h1>
        </div>
      </div>
      <div className="flex justify-between mb-2 w-full p-3">
        <div
          className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
          onClick={() => router.push(`/${username}`)}
        >
          {postInfo?.user?.photo ? (
            <img
              src={postInfo?.user?.photo}
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
          <div className="flex flex-col justify-start mb-1">
            <span
              onClick={() => router.push(`/${username}`)}
              className="font-semibold text-white cursor-pointer hover:underline"
            >
              {postInfo?.user?.name}
            </span>
            <span className="text-white/45">@{username}</span>
          </div>
          <div className="mb-3 mt-1.5 font-normal text-md text-slate-200">
            {postInfo.text}
          </div>
          {postInfo.image && (
            <div className="mb-3">
              <img
                src={postInfo.image}
                alt="Post Image"
                className="w-full h-auto rounded-2xl border border-white/15 p-1 object-cover shadow-md"
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
          <div className="text-white/55 text-sm">
            {format(new Date(postInfo?.createdAt), "h:mm a · MMM d, yyyy")}
          </div>
        </div>
        {session?.user.username === username && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex justify-center items-center text-gray-600 cursor-pointer hover:text-sky-600 hover:bg-sky-600/20 p-1 w-8 h-8 rounded-full">
                <Ellipsis size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 outline-none bg-black hover:bg-white/5">
              <div
                onClick={handleDeletePost}
                className=" cursor-pointer text-white text-md p-2"
              >
                <div className="flex gap-1.5 font-semibold text-red-500 ">
                  <Trash2 size={20} />
                  <span>Delete</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="border border-white/15 w-full" />
      <div className="flex justify-between items-center px-2 my-2 text-gray-400">
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
              <div>
                <RWebShare
                  data={{
                    text: "Like humans, flamingos make friends for life",
                    url: window.location.href,
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
                className="flex items-center cursor-pointer transition-colors duration-150 hover:text-sky-500"
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
                <span>{postInfo.bookmark?.length || 0}</span>
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-600 text-white">
              <p>Bookmark</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="border border-white/15 w-full" />
      <div className="flex gap-3 px-2 py-2 mt-2.5">
        <div className="h-12 w-12 rounded-full bg-gray-600 flex justify-center items-center text-white">
          {userInfo.photo ? (
            <img
              src={userInfo.photo}
              alt="Profile Photo"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            userInfo.username &&
            userInfo.username.length > 0 &&
            userInfo.username.charAt(0).toUpperCase()
          )}
        </div>
        <textarea
          ref={textareaRef}
          className="bg-transparent mt-1 text-white text-lg placeholder-gray-500 w-full h-auto outline-none resize-none"
          placeholder={`Reply to @${username}`}
          autoFocus
          value={text}
          onChange={handleTextChange}
          style={{
            minHeight: "24px",
            maxHeight: "720px",
            overflow: "hidden",
          }}
        />
      </div>

      <div className="flex gap-2 justify-end items-center mb-3 mr-3">
        <Button
          onClick={handleReply}
          disabled={text.length === 0 || uploading}
          className="rounded-full bg-sky-500 hover:bg-sky-500 px-5 py-2 text-white font-semibold"
        >
          {uploading ? "Uploading..." : "Reply"}
        </Button>
      </div>

      <div className="border w-full border-white/15" />
      <div className="w-full flex flex-col">
        {postInfo?.comments?.map((comment: any, index: number) => (
          <CommentBox
            id={comment.id}
            key={comment.id}
            text={comment.text}
            userImage={comment?.user?.photo}
            username={comment?.user?.username}
            createdAtInfo={comment?.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
