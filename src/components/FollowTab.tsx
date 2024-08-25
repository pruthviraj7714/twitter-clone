"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FollowTab() {
  const pathname = usePathname();
  const router = useRouter();
  const pathSegments = pathname.split("/");
  const username = pathSegments[1];

  return (
    <section className="border border-l border-r border-white/15">
      <div className="w-full flex flex-col bg-black text-white">
        <div className="flex items-center px-4 py-2 bg-black">
          <ArrowLeft
            className="cursor-pointer"
            size={24}
            onClick={() => router.back()}
          />
          <div className="ml-4">
            <h1 className="text-lg font-bold">{username}</h1>
          </div>
        </div>
        <div className="flex justify-around items-center border-b border-gray-700">
          <Link href={`/${username}/following`}>
            <div
              className={`cursor-pointer py-4 text-center w-full hover:bg-white/15 px-16 ${
                pathname.endsWith("/following")
                  ? "text-white font-semibold border-b-4 border-sky-500"
                  : "text-gray-500"
              }`}
            >
              Following
            </div>
          </Link>
          <Link href={`/${username}/followers`}>
            <div
              className={`cursor-pointer py-4 text-center w-full hover:bg-white/15 px-16 ${
                pathname.endsWith("/followers")
                  ? "text-white font-semibold border-b-4 border-sky-500"
                  : "text-gray-500"
              }`}
            >
              Followers
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
