"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import axios from "axios";

export default function ProfileMiniCard({
  photo,
  name,
  username,
  isFollow,
}: {
  photo: string;
  name: string;
  username: string;
  isFollow: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(isFollow);
  const {toast } = useToast();
  const handleFollow = async () => {
    try {
      await axios.post("/api/user/follow", {
        followUser: username,
      });
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      toast({
        title: error?.response?.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center w-full p-2 border-b border-white/15 hover:bg-white/5 px-2">
      <div className="flex justify-start items-center gap-1.5">
        <div className="h-10 w-10 rounded-md">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="flex justify-center items-center h-full w-full border border-white/15">
              {username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">{name}</h2>
          <p className="text-white/55">@{username}</p>
        </div>
      </div>
      <div onClick={handleFollow}>
        {isFollowing ? (
          <Button className="rounded-full bg-black text-white font-semibold mt-2 border border-white/15">
            Following
          </Button>
        ) : (
          <Button className="rounded-full bg-white text-black font-semibold mt-2 hover:bg-white/85">
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}
