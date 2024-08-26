"use client";
import ProfileCard from "@/components/ProfileCard";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/hooks/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FollowersPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const [follwers, setFollwers] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading, userInfo } = useUserInfo();
  const { toast } = useToast();
  const getFollowers = async () => {
    try {
      const res = await axios.get("/api/user/followers", {
        params: {
          username: params.username,
        },
      });
      setFollwers(res.data.followers);
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
    getFollowers();
  }, []);

  if (loading || isLoading || status === "loading") {
    return (
      <>
        {new Array(4).fill(null).map((_, index) => (
          <div
            key={index}
            className="w-full border-b border-white/15 hover:bg-white/5 p-2 px-2 animate-pulse"
          >
            <div className="flex justify-between mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden"></div>
              <div className="flex-1">
                <div className="flex flex-col justify-start mb-1">
                  <div className="h-4 bg-gray-600 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-500 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col border-l border-r border-white/15 min-h-screen">
      {follwers && follwers.length > 0 ? (
        follwers.map((f: any) => (
          <ProfileCard
            key={f.id}
            username={f?.following?.username}
            profilePhoto={f?.following?.photo}
            bio={f?.following?.bio}
            isFollow={userInfo.followings.some(
              (l: any) => l.followerId === f.followingId
            )}
          />
        ))
      ) : (
        <div className="flex justify-center items-center text-xl font-bold h-36">
          @{params.username} doesn’t have any followers.
        </div>
      )}
    </div>
  );
}
