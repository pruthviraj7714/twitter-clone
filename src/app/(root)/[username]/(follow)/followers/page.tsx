"use client";
import ProfileCard from "@/components/ProfileCard";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export default function FollowersPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const [follwers, setFollwers] = useState<any[]>([]);
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
    }
  };

  useEffect(() => {
    getFollowers();
  }, []);

  return (
    <div className="flex flex-col border-l border-r border-white/15 min-h-screen">
      {follwers && follwers.length > 0 ? (
        follwers.map((f: any) => (
          <ProfileCard
            username={f.username}
            profilePhoto={f.photo}
            bio={f.bio}
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
