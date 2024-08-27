"use client";
import ProfileTabs from "@/components/ProfileTabs";
import { ProfileSetupDialog } from "@/components/SetupProfile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ArrowLeft, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const { toast } = useToast();
  const {data : session, status} = useSession();
  const username = params.username;
  const [openProfileDialog, setOpenProfileDialog] = useState<boolean>(false);
  const router = useRouter();
  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user/profile?username=${username}`);
      setUserInfo(res.data);
      setIsFollow(
        res.data.followers.some((l: any) => l.followingId === Number(session?.user.id))
      );
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post("/api/user/follow", {
        followUser: params.username,
      });
      setIsFollow(!isFollow);
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
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
              router.back();
            }}
          />
        </div>
        <div className="ml-6 text-md">
          <h1 className="text-lg font-bold">{userInfo.name}</h1>
          <p className="text-gray-500 text-sm">
            {userInfo.posts?.length} posts
          </p>
        </div>
      </div>
      <div className="w-full h-48 bg-gray-600">
        {userInfo.headerPhoto && (
          <img
            src={userInfo.headerPhoto}
            alt="Header Photo"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex justify-between px-4 h-20">
        <div className="relative h-32 w-32 bottom-16 rounded-full bg-gray-700 border-4 border-black">
          {userInfo.photo ? (
            <img
              src={userInfo.photo}
              alt="Profile Photo"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full font-semibold flex justify-center items-center text-4xl p-5 mt-1.5">
              {userInfo.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {session?.user.username === username ? (
          <Button onClick={() => setOpenProfileDialog(true)} className="rounded-full bg-transparent border border-gray-500 font-bold mt-2">
            Edit Profile
          </Button>
        ) : (
          <div onClick={handleFollow}>
            {isFollow ? (
              <Button className="rounded-full bg-black text-white font-semibold mt-2 hover:bg-white/10 border border-white/15 ">Following</Button>
            ) : (
              <Button className="rounded-full bg-white text-black font-semibold mt-2 hover:bg-white/85">
                Follow
              </Button>
            )}
          </div>
        )}
      </div>
      {openProfileDialog && <ProfileSetupDialog open={openProfileDialog} onOpenChange={setOpenProfileDialog} />}
      <div className="flex flex-col justify-start p-4">
        <div>
          <h1 className="text-xl font-bold">{userInfo.name}</h1>
          <h4 className="text-gray-500 text-md">@{userInfo.username}</h4>
        </div>
        <div className="text-md font-normal mt-2.5">{userInfo.bio}</div>
        <div className="flex items-center text-gray-600 text-md mt-2.5">
          <Calendar size={20} />
          <p className="ml-1.5">Joined May 2023</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 gap-3 mt-1.5">
          <div
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/${username}/following`)}
          >
            <span className="font-semibold text-white">
              {userInfo.followings?.length}
            </span>{" "}
            Following
          </div>
          <div
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/${username}/followers`)}
          >
            <span className="font-semibold text-white">
              {userInfo.followers?.length}
            </span>{" "}
            Followers
          </div>
        </div>
      </div>
      <ProfileTabs
        username={username}
        posts={userInfo.posts}
        likes={userInfo.likes}
        bookmarks={userInfo.bookmarks}
      />
    </div>
  );
}
