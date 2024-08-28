"use client";
import PostBox from "@/components/PostBox";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Bookmarkpage() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const getUserInfo = async () => {
    try {
      const res = await axios.get(
        `/api/user/profile?username=${session?.data?.user.username}`
      );
      setUserInfo(res.data);
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-l border-r p-2 border-white/15 bg-black min-h-screen text-white">
      <div className="h-16 bg-black flex justify-start items-center">
        <div className="flex items-center">
          <ArrowLeft
            className="ml-1.5 cursor-pointer"
            size={20}
            onClick={() => {
              router.back();
            }}
          />
        </div>
        <div className="ml-6 text-md">
          <h1 className="text-lg font-bold text-left">Bookmarks</h1>
          <h1 className="text-md text-gray-500">@{userInfo.username}</h1>
        </div>
      </div>
      <div className="w-full border border-white/15" />
      <div className="flex flex-col">
        {userInfo?.bookmarks && userInfo.bookmarks.length > 0 ? (
          userInfo?.bookmarks?.map((b: any) => (
            <PostBox
              id={b.postId}
              key={b.postId}
              bookmarks={userInfo?.bookmarks}
            />
          ))
        ) : (
          <div className="h-screen flex justify-center items-center text-lg font-semibold">
            No bookmarks yet
          </div>
        )}
      </div>
    </div>
  );
}
