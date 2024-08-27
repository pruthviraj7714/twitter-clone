"use client";
import { Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideApp from "./SideApp";
import { useState } from "react";
import {
  GoBell,
  GoBellFill,
  GoBookmark,
  GoBookmarkFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { FaRegUser, FaSearch, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <div className="max-h-screen w-[275px] p-4 mr-8">
      <div className="flex flex-col justify-center items-start">
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
          <div className="text-white flex justify-center items-center bg-sky-500 text-center rounded-full font-semibold px-8 py-3 mt-4 cursor-pointer hover:bg-sky-400">
            Post
          </div>
          <div
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/");
            }}
            className="text-white flex justify-center items-center bg-sky-500 text-center rounded-full font-semibold px-8 py-3 mt-4 cursor-pointer hover:bg-sky-400"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
