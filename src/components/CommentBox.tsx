"use client";
import { format } from "date-fns";
import { Dot, Ellipsis, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import axios from "axios";

export default function CommentBox({
  id,
  username,
  userImage,
  createdAtInfo,
  text,
}: {
  id: string;
  username: string;
  userImage: string;
  createdAtInfo: Date;
  text: string;
}) {
  const router = useRouter();

  const now = new Date();
  const createdAt = createdAtInfo || now;
  const seconds = Math.floor(
    (now.getTime() - new Date(createdAt).getTime()) / 1000
  );

  const { toast } = useToast();

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

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/post/comment/delete?commentId=${id}`);
      toast({
        title: "Comment Successfully Deleted",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: error?.response?.data.message,
      });
    }
  };

  return (
    <div className="flex justify-between mb-2 p-2 border-b border-white/15">
      <div
        className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
        onClick={() => router.push(`/${username}`)}
      >
        {userImage ? (
          <img
            src={userImage}
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
        <div className="mb-3 font-normal text-md text-slate-200">{text}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-center items-center text-gray-600 cursor-pointer hover:text-sky-600 hover:bg-sky-600/20 p-1 w-8 h-8 rounded-full">
            <Ellipsis size={20} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 outline-none bg-black hover:bg-white/5">
          <div
            onClick={handleDeleteComment}
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
  );
}
