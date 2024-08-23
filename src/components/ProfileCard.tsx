"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function ProfileCard({
  username,
  profilePhoto,
  bio,
}: {
  username: string;
  profilePhoto: string;
  bio: string;
}) {
  const router = useRouter();
  return (
    <div className="w-full border-b border-white/15 hover:bg-white/5 p-2 px-2">
      <div className="flex justify-between mb-2">
        <div
          className="w-10 h-10 rounded-full bg-gray-600 mr-4 overflow-hidden cursor-pointer"
          onClick={() => router.push(`/${username}`)}
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
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
              {username}
            </span>
            <span className="text-gray-400">@{username}</span>
            <p>{bio}</p>
          </div>
        </div>
        <div>
          <Button className="rounded-full bg-white text-black font-semibold mt-2 hover:bg-white/85">
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
}
