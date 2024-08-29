import { format } from "date-fns";
import { Dot, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { userInfo } from "os";
import { FaHeart, FaUser } from "react-icons/fa";

export default function NotificationBox({
  id,
  type,
  follower,
  post,
  followerId,
  liker,
  likerId,
  replier,
  name,
  comment,
  postId,
  user,
  read,
  username
}: {
  id: number;
  type: "FOLLOW" | "LIKE" | "REPLY";
  follower: any;
  post: any;
  followerId: number;
  liker: any;
  user: any;
  replier: any;
  likerId: number;
  postId: string;
  comment : any;
  read: boolean;
  name : string;
  username : string;
}) {
  const router = useRouter();
  const now = new Date();
  const createdAt = comment?.createdAt || now;
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
  return (
    <div className="border-b border-white/15 hover:bg-white/5 py-3">
      {type === "FOLLOW" && (
        <div className="flex justify-start gap-2.5 items-center px-6">
          <div className="mb-10">
            <FaUser size={27} className="text-sky-500" />
          </div>
          <div className="flex flex-col">
            <div className="h-10 w-10">
              <img
                src={follower.photo}
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div className="mt-3">
              <span
                className="font-bold cursor-pointer hover:underline"
                onClick={() => {
                  router.push(`/${follower.username}`);
                }}
              >
                {follower.name}
              </span>{" "}
              followed you
            </div>
          </div>
        </div>
      )}
      {type === "LIKE" && (
        <div onClick={() => router.push(`/${username}/${postId}`)} className="flex items-start gap-2.5 px-6 cursor-pointer">
          <div className="mt-6">
            <FaHeart size={27} className="text-pink-500" />
          </div>
          <div className="flex flex-col justify-center cursor-pointer">
            <div onClick={(e:any) => {
                e.stopPropagation();
                  router.push(`/${liker.username}`);
                }} className="h-10 w-10 mt-4">
              {liker.photo ? (
                <img
                  src={liker.photo}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex justify-center items-center rounded-full border border-white/15">
                  {liker.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-1">
              <span
                className="font-bold cursor-pointer hover:underline"
                onClick={(e:any) => {
                    e.stopPropagation();
                  router.push(`/${liker.username}`);
                }}
              >
                {liker.name}
              </span>{" "}
              liked your post
            </div>
            <div className="mt-1.5 text-white/55 overflow-y-auto">
              {post.text}
            </div>
          </div>
        </div>
      )}
      {type === "REPLY" && (
        <div onClick={() => router.push(`/${username}/${comment.postId}`)} className="flex justify-between mb-1 px-5 cursor-pointer">
          <div
            className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
            onClick={(e: any) => {
              e.stopPropagation();
              router.push(`/${replier.username}`);
            }}
          >
            {replier.photo ? (
              <img
                src={replier.photo}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center text-white text-xl">
                {replier.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-start items-center mb-1">
              <span
                onClick={(e: any) => {
                  e.stopPropagation();
                  router.push(`/${replier.username}`);
                }}
                className="font-semibold text-white cursor-pointer hover:underline"
              >
                {replier.name}
              </span>
              <span className="ml-2 text-gray-400">@{replier.username}</span>
              <span className="text-gray-400">
                <Dot size={15} />
              </span>
              <span className="text-gray-400 text-sm">{relativeTime}</span>
            </div>
            <div className="mb-3  text-white/55 text-sm">
              Replying to <span onClick={(e:any) => {
                e.stopPropagation()
                router.push(`/${username}`)}} className="text-sky-500 cursor-pointer hover:underline">@{username}</span>
            </div>
            <div>
                {comment.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
