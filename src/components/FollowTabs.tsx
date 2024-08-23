"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FollowTabs() {
  const router = useRouter();
  return (
    <div>
      <div className="h-16 bg-black flex justify-start items-center">
        <div className="flex items-center">
          <ArrowLeft
            className="ml-1.5 cursor-pointer"
            size={20}
            onClick={() => {
              router.push("/home");
            }}
          />
        </div>
        <div className="ml-6 text-md">
          <h1 className="text-lg font-bold">Test</h1>
          <p className="text-gray-500 text-sm">posts</p>
        </div>
      </div>
    </div>
  );
}
