import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DialogProps } from "@radix-ui/react-dialog";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

const CreateAccountDialog = ({ open, onOpenChange }: DialogProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSignup = async () => {
    try {
      const res = await axios.post("/api/auth/signup", {
        name,
        username,
        email,
        password,
      });
      toast({
        title : res.data.message,
        description : "Now Sign in with your credentials"
      })
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        variant : "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-black text-white sm:min-w-[600px] sm:min-h-[500px] rounded-2xl shadow-2xl transform transition-all duration-300 ease-out hover:scale-105">
      <DialogHeader>
        <div className="flex justify-center items-center my-5">
          <Image
            src={"/logo.jpg"}
            alt={"logo"}
            height={60}
            width={60}
            className="rounded-full shadow-xl"
          />
        </div>
        <DialogTitle className="text-4xl text-center font-extrabold tracking-tight mb-4">
          Create Your Account
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 py-6 px-6">
        <div className="flex items-center gap-4">
          <Label
            htmlFor="username"
            className="w-1/3 text-right text-lg font-semibold tracking-wide"
          >
            Username
          </Label>
          <Input
            id="username"
            className="w-2/3 bg-transparent text-white rounded-lg px-4 py-3 shadow-inner focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="name"
            className="w-1/3 text-right text-lg font-semibold tracking-wide"
          >
            Name
          </Label>
          <Input
            id="name"
            className="w-2/3 bg-transparent text-white rounded-lg px-4 py-3 shadow-inner focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="email"
            className="w-1/3 text-right text-lg font-semibold tracking-wide"
          >
            Email
          </Label>
          <Input
            id="email"
            className="w-2/3 bg-transparent text-white rounded-lg px-4 py-3 shadow-inner focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label
            htmlFor="password"
            className="w-1/3 text-right text-lg font-semibold tracking-wide"
          >
            Password
          </Label>
          <Input
            id="password"
            className="w-2/3 bg-transparent text-white rounded-lg px-4 py-3 shadow-inner focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter className="flex justify-center py-4">
        <Button
          onClick={handleSignup}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full px-10 py-3 shadow-xl transition-transform transform hover:scale-105 active:scale-95"
        >
          Create Account
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  );
};

export default CreateAccountDialog;
