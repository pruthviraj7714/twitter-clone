"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import CreateAccountDialog from "./CreateAccountDialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInDialog = ({ open, onOpenChange }: DialogProps) => {
  const [isCreateAccountDialogOpen, setIsCreateAccountDialogOpen] =
    useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { toast } = useToast();
  const handelSignin = async () => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.ok) {
        toast({
          title: "Successfully signed in",
        });
        router.push('/home')
      } else {
        toast({
          title: "signin Failed",
          description: res?.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "signin Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white w-[360px] md:w-[466px] border border-gray-700 rounded-lg shadow-lg">
        <DialogHeader>
          <div className="flex justify-center items-center my-3">
            <Image
              src={"/logo.jpg"}
              alt={"logo"}
              height={50}
              width={50}
              className="rounded-full shadow-md"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold mb-2">
            Sign In
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your credentials to access your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6 px-4">
          <div className="flex items-center gap-4">
            <Label
              htmlFor="email"
              className="w-1/3 text-right text-lg font-semibold"
            >
              Email
            </Label>
            <Input
              id="email"
              className="w-2/3 bg-transparent text-white rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="password"
              className="w-1/3 text-right text-lg font-semibold"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="w-2/3 bg-transparent text-white rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex text-sm gap-1.5 text-gray-400 mt-2">
            <span>Don&apos;t have an account?</span>
            <span
              onClick={() => setIsCreateAccountDialogOpen(true)}
              className="text-blue-600 underline cursor-pointer"
            >
              sign up
            </span>
          </div>
          <CreateAccountDialog
            open={isCreateAccountDialogOpen}
            onOpenChange={setIsCreateAccountDialogOpen}
          />
        </div>
        <DialogFooter className="flex justify-center py-4">
          <Button
            onClick={handelSignin}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-8 py-2 shadow-lg transition-all w-full"
          >
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
