"use client";
import ProfileCard from "@/components/ProfileCard";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/hooks/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FollowingsPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const [followings, setFollowings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const { isLoading, userInfo } = useUserInfo();
  const { toast } = useToast();

  const getFollowings = async () => {
    try {
      const res = await axios.get("/api/user/following", {
        params: {
          username: params.username,
        },
      });
      console.log(res.data.followings);
      setFollowings(res.data.followings);
    } catch (error: any) {
      toast({
        title: error?.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getFollowings();
    }
  }, [status]);

  if (loading || isLoading || status !== "authenticated") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col border-l border-r border-white/15 min-h-screen">
      {followings && followings.length > 0 ? (
        followings.map((f: any) => (
          <ProfileCard
            key={f.id}
            username={f.follower.username}
            profilePhoto={f.follower.photo}
            bio={f.follower.bio}
            isFollow={userInfo.followings.some((l : any) => l.followerId === f.followerId)}
          />
        ))
      ) : (
        <div className="flex justify-center items-center text-xl font-bold h-36">
          @{params.username} doesn’t follow anyone yet.
        </div>
      )}
    </div>
  );
}
