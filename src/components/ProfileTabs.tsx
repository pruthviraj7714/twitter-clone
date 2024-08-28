"use client";
import { useState } from "react";
import PostBox from "./PostBox";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileTabs({
  username,
  posts,
  likes,
  bookmarks,
  comments,
}: {
  username: string;
  posts: any[];
  likes: any[];
  bookmarks: any[];
  comments: any[];
}) {
  const session = useSession();
  const baseTabs = ["Posts", "Replies", "Media"];
  const router = useRouter();
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
        <div
          className={`flex justify-center items-center ${
            activeTab !== "Posts" ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col justify-center items-center w-full">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostBox id={post.id} key={post.id} bookmarks={bookmarks} />
              ))
            ) : (
              <div className="font-bold mt-10">No posts available.</div>
            )}
          </div>
        </div>
        <div
          className={`flex justify-center items-center ${
            activeTab !== "Replies" ? "hidden" : ""
          }`}
        >
          {comments && comments.length > 0 ? (
            <div className="w-full">
              {comments.map((comment: any) => (
                <PostBox
                  key={comment.id}
                  id={comment.postId}
                  bookmarks={bookmarks}
                />
              ))}
            </div>
          ) : (
            <div className="font-bold mt-10">
              @{username} haven't replied to any posts yet.
            </div>
          )}
        </div>
        <div
          className={`flex justify-center items-center ${
            activeTab !== "Likes" ? "hidden" : ""
          }`}
        >
          {likes && likes.length > 0 ? (
            <div className="w-full">
              {likes.map((l: any) => (
                <PostBox key={l.id} id={l.postId} bookmarks={bookmarks} />
              ))}
            </div>
          ) : (
            <div className="font-bold mt-10">
              @{username} haven't liked any posts yet.
            </div>
          )}
        </div>
        <div
          className={`flex justify-center items-center ${
            activeTab !== "Media" ? "hidden" : ""
          }`}
        >
          {posts && posts.length > 0 ? (
            posts.filter((post: any) => post.image || post.video).length > 0 ? (
              <div className="w-full grid grid-cols-3">
                {posts
                  .filter((post: any) => post.image || post.video)
                  .map((p: any) => (
                    <div
                      onClick={() => router.push(`/${username}/${p.id}`)}
                      className="cursor-pointer"
                      key={p.id}
                    >
                      <img
                        id={p.postId}
                        src={p.image || p.video}
                        alt={p.title}
                        className="h-40 w-56 p-1 border-2 border-white/15 object-contain"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="font-bold mt-10">
                No media content available yet.
              </div>
            )
          ) : (
            <div className="font-bold mt-10">
              No media content available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
