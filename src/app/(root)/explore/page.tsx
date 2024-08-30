"use client";

import ProfileCard from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function ExplorePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const getAllUsers = async () => {
    try {
      const res = await axios.get(`/api/user/all?query=${query}`);
      setUsers(res.data.users);
      console.log(res.data);
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
    if (status !== "loading") {
      console.log(
        users[0]?.followers?.some(
          (l: any) => l.followingId === Number(session?.user.id)
        )
      );
    }
  }, [status, query]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="border-l border-r p-2 border-white/15 bg-black text-white flex flex-col min-h-screen">
      <div className="flex items-center justify-center bg-transparent rounded-full px-4 py-2 shadow-lg hover:border hover:border-sky-500">
        <FaSearch size={20} className="text-sky-500 mr-3" />
        <Input
          className="w-[500px] bg-transparent text-white placeholder-gray-400  outline-none border-none focus:outline-none focus-visible:ring-0 focus-visible:border-sky-400 focus:border-sky-400 focus-visible:ring-offset-0"
          placeholder="Search"
          onChange={(e) => {
            setTimeout(() => setQuery(e.target.value), 700);
          }}
        />
      </div>
      {users && users.length > 0 ? (
        <div className="flex flex-col">
          {users.map((user) => (
            <ProfileCard
              key={user.id}
              username={user.username}
              name={user.name}
              profilePhoto={user.photo}
              bio={user.bio}
              isFollow={user?.followers?.some(
                (l: any) => l.followingId === Number(session?.user.id)
              )}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-10 text-lg font-semibold">
          No User found
        </div>
      )}
    </div>
  );
}
