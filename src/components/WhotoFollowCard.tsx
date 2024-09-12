"use client";
import { useEffect, useState } from "react";
import ProfileMiniCard from "./ProfileMiniCard";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useSession } from "next-auth/react";

export default function WhotoFollowCard() {
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/user/all");
      setUsers(res.data.users);
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
    getAllUsers();
  }, []);

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center border border-white/15 rounded-xl w-full min-h-[150px] mt-20">
        <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start border border-white/15 rounded-xl w-full mt-10 min-h-[150px]">
      <h1 className="font-extrabold text-xl my-3.5 ml-2.5">Who to follow</h1>
      {users && users.length > 0 ? (
        <div>
          {users
            ?.filter(
              (user: any) =>
                user.id !== Number(session?.user.id) &&
                !user?.followers?.some(
                  (u: any) => u.followingId === Number(session?.user.id)
                )
            )
            .slice(0, 5)
            .map((user) => (
              <ProfileMiniCard
                key={user.id}
                username={user.username}
                name={user.name}
                photo={user.photo}
                isFollow={user?.followers?.some(
                  (u: any) => u.followingId === Number(session?.user.id)
                )}
              />
            ))}
        </div>
      ) : (
        <div className="flex justify-center font-bold mt-5 text-white">
          No Users Found
        </div>
      )}
    </div>
  );
}
