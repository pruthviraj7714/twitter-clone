"use client";
import NotificationBox from "@/components/NotificationBox";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfo } from "@/hooks/user";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isLoading, userInfo } = useUserInfo();
  const router = useRouter();
  

  useEffect(() => {
    if (userInfo) {
      setNotifications(userInfo.notificationsAsUser);
      console.log(userInfo);
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex flex-col border-l border-r border-white/15 min-h-screen">
      <div className="h-16 bg-black flex justify-start items-center border-b border-white/15">
        <div className="flex items-center">
          <ArrowLeft
            className="ml-1.5 cursor-pointer"
            size={20}
            onClick={() => {
              router.back();
            }}
          />
        </div>
        <div className="ml-6 text-md">
          <h1 className="text-lg font-bold text-left">Notifications</h1>
        </div>
      </div>
      {notifications &&
        notifications.map((notification) => (
          <NotificationBox key={notification.id} username={userInfo.username} name={userInfo.name} {...notification} />
        ))}
    </div>
  );
}
