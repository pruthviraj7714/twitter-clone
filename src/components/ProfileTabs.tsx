"use client";
import { useState } from "react";
import PostBox from "./PostBox";
import { useSession } from "next-auth/react";


export default function ProfileTabs({
  username,
  posts,
  likes,
  bookmarks,
}: {
  username: string;
  posts: any[];
  likes: any[];
  bookmarks: any[];
}) {
  const session = useSession();
  const baseTabs = ["Posts", "Replies", "Media"];

  const Tabs =
    session?.data?.user.username === username
      ? [...baseTabs, "Likes"]
      : baseTabs;
  const [activeTab, setActiveTab] = useState<any>("Posts");

  return (
    <div className="flex flex-col w-full px-2">
      <div className="flex justify-between items-center px-3">
        {Tabs.map((t) => (
          <div
            key={t}
            onClick={() => {
              setActiveTab(t);
            }}
            className={`cursor-pointer px-10 py-2 hover:bg-white/5 ${
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
        <div className={`flex justify-center items-center ${activeTab !== "Posts" ? "hidden" : ""}`}>
          <div className="flex flex-col w-full">
            {posts &&
              posts.length > 0 &&
              posts.map((post: any) => (
                <PostBox id={post.id} key={post.id} bookmarks={bookmarks} />
              ))}
          </div>
        </div>
        <div className={`flex justify-center items-center ${activeTab !== "Replies" ? "hidden" : ""}`}>
          No Replies on any posts yet
        </div>
        <div className={`flex justify-center items-center ${activeTab !== "Likes" ? "hidden" : ""}`}>
          {likes && likes.length > 0 ? (
            <div className="w-full">
              {likes.map((l: any) => (
                <PostBox key={l.id} id={l.postId} bookmarks={bookmarks} />
              ))}
            </div>
          ) : (
            <div>
              You didn't like any posts yet!
            </div>
          )}
        </div>
        <div className={`flex justify-center items-center ${activeTab !== "Media" ? "hidden" : ""}`}>
          You didn't like any posts yet
        </div>
      </div>
    </div>
  );
}
