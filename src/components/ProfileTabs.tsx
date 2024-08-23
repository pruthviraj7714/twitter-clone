"use client";
import { useEffect, useState } from "react";
import PostBox from "./PostBox";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "./ui/use-toast";

export default function ProfileTabs({
  posts,
}: {
  posts: any[];
}) {
  const session = useSession();
  const Tabs = ["Posts", "Replies", "Media"];
  const [activeTab, setActiveTab] = useState<any>("Posts");
  const { toast } = useToast();


  return (
    <div className="flex flex-col w-full px-2">
      <div className="flex justify-between items-center px-3">
        {Tabs.map((t) => (
          <div
            key={t}
            onClick={() => {
              setActiveTab(t);
            }}
            className={`cursor-pointer px-12 py-2 hover:bg-white/5 ${
              activeTab === t
                ? "text-white font-semibold border-b-4 border-sky-500"
                : "text-gray-600"
            }`}
          >
            {t}
          </div>
        ))}
      </div>
      <div className="w-full">
        {activeTab === "Posts" && (
          <div
            className={`flex justify-center items-center ${
              activeTab !== "Posts" ? "hidden" : "visible"
            }`}
          >
            <div className="flex flex-col w-full">
              {posts &&
                posts.length > 0 &&
                posts.map((post: any) => (
                  <PostBox id={post.id} key={post.id} />
                ))}
            </div>
          </div>
        )}
        {activeTab === "Replies" && (
          <div
            className={`flex justify-center items-center ${
              activeTab !== "Replies" ? "hidden" : "visible"
            }`}
          >
            No Replies on any posts yet
          </div>
        )}
        {activeTab === "Likes" && (
          <div
            className={`flex justify-center items-center ${
              activeTab !== "Likes" ? "hidden" : "visible"
            }`}
          >
            You didn't Liked Any Posts yet
          </div>
        )}
        {activeTab === "Media" && (
          <div
            className={`flex justify-center items-center ${
              activeTab !== "Likes" ? "hidden" : "visible"
            }`}
          >
            You didn't Liked Any Posts yet
          </div>
        )}
      </div>
    </div>
  );
}
