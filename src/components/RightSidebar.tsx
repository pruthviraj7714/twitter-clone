"use client"

import { useState } from "react"
import ProfileMiniCard from "./ProfileMiniCard";
import SubscribeBox from "./SubscribeBox";

export default function RightSidebar() {
    const [users, setUsers] = useState<any[]>([]);
    return (
        <div className="flex flex-col justify-center items-center">
            <SubscribeBox />
            <div className="flex flex-col justify-center border border-white/15 rounded-xl w-full mt-10">
                <h1 className="font-extrabold text-xl my-3.5 ml-2.5">Who to follow</h1>
                <ProfileMiniCard />
                <ProfileMiniCard />
                <ProfileMiniCard />
                <ProfileMiniCard />
                <ProfileMiniCard />
                <ProfileMiniCard />

            </div>
        </div>
    )
}