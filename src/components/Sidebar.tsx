"use client";
import { Bell, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideApp from "./SideApp";
import { useEffect, useState } from "react";
import {
  GoBell,
  GoBellFill,
  GoBookmark,
  GoBookmarkFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaRegUser, FaSearch, FaUser } from "react-icons/fa";
import TweetDialog from "./TweetDialog";
import { useUserInfo } from "@/hooks/user";

const Sidebar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("home");
  const { isLoading, pendingNotificationCount } = useUserInfo();
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  useEffect(() => {}, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center rounded-xl w-full min-h-[150px] h-screen">
        <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-h-screen w-[275px] p-4 mr-8">
      <div className="hidden lg:flex flex-col justify-center items-start">
        <div>
          <Image
            src={"/logo.jpg"}
            alt="Logo"
            className="mb-6 cursor-pointer p-1 hover:bg-slate-800 hover:rounded-full"
            width={50}
            height={50}
          />
          <SideApp
            name="Home"
            isActive={activeTab === "home"}
            ActiveIcon={GoHomeFill}
            onClick={() => {
              router.push("/home"), setActiveTab("home");
            }}
            Icon={GoHome}
          />
          <SideApp
            name="Explore"
            isActive={activeTab === "explore"}
            ActiveIcon={FaSearch}
            onClick={() => {
              router.push("/explore");
              setActiveTab("explore");
            }}
            Icon={Search}
          />
          {pendingNotificationCount > 0 && (
            <div className="absolute bg-sky-500 text-white p-1 text-sm h-5 w-5 rounded-full flex justify-center items-center">
              {pendingNotificationCount}
            </div>
          )}
          <SideApp
            name="Notifications"
            isActive={activeTab === "notifications"}
            ActiveIcon={GoBellFill}
            onClick={() => {
              router.push("/notifications");
              setActiveTab("notifications");
            }}
            Icon={GoBell}
          />

          <SideApp
            name="Bookmarks"
            isActive={activeTab === "bookmarks"}
            ActiveIcon={GoBookmarkFill}
            onClick={() => {
              router.push("/i/bookmarks");
              setActiveTab("bookmarks");
            }}
            Icon={GoBookmark}
          />
          <SideApp
            name="Profile"
            isActive={activeTab === "profile"}
            ActiveIcon={FaUser}
            onClick={() => {
              router.push(`/${session?.user.username}`);
              setActiveTab("profile");
            }}
            Icon={FaRegUser}
          />
          <div
            onClick={() => {
              setPostDialogOpen(!postDialogOpen);
            }}
            className="text-white flex justify-center items-center bg-sky-500 text-center rounded-full font-semibold px-8 py-3 mt-4 cursor-pointer hover:bg-sky-400"
          >
            Post
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="text-white flex justify-center items-center bg-sky-500 text-center rounded-full font-semibold px-8 py-3 mt-4 cursor-pointer hover:bg-sky-400">
                Logout
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black text-red-500">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in
                  again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-sky-500 text-white hover:bg-sky-600 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push("/");
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {postDialogOpen && (
        <TweetDialog open={postDialogOpen} onOpenChange={setPostDialogOpen} />
      )}
    </div>
  );
};

export default Sidebar;
