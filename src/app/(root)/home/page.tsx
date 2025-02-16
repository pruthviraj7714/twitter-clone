"use client";
import PostBox from "@/components/PostBox";
import Twitte from "@/components/TwitteBox";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/info");
      setUserInfo(res.data);
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const getPosts = async () => {
    try {
      const res = await axios.get("/api/post/all");
      setPosts(res.data.posts);
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };
  const handleCreatePost = async ( {payload} : {payload : any}) => {
    try {
      const res = await axios.post("/api/post/create", payload);
      // getPosts();
      setPosts((prev) => [...prev, res.data.post].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error: any) {
      toast({
        title: error.response?.data?.message || "Failed to create post",
        variant: "destructive",
      });
    }
  }
  const handleDeletePost = async (postId : string) => {
    try {
      await axios.delete(`/api/post/delete?postId=${postId}`);
      toast({
        title : "Post Successfully deleted!"
      })
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getUserInfo();
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center border-l border-r border-white/15 bg-black">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent border-t-4 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="border-l border-r p-2 border-white/15 bg-black text-white flex flex-col">
      <Twitte photo={userInfo?.photo} username={userInfo?.username} onAddPost={handleCreatePost} />

      {posts.map((post) => (
        <PostBox
          id={post.id}
          key={post.id}
          bookmarks={userInfo?.bookmarks}
          onDelete={() => handleDeletePost(post.id)}
        />
      ))}
    </div>
  );
}
