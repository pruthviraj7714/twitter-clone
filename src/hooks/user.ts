"use client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pendingNotificationCount, setPendingNotificationCount] =
    useState<number>(0);
  const { toast } = useToast();

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/user/info");
      setUserInfo(res.data);
      setPendingNotificationCount(
        res.data.notificationsAsUser?.filter(
          (notification: any) => notification.read === false
        ).length
      );
    } catch (error: any) {
      toast({
        title: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return { isLoading, userInfo, pendingNotificationCount };
};
