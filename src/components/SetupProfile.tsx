"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogProps } from "@radix-ui/react-dialog";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Textarea } from "./ui/textarea";
import { MdAddAPhoto } from "react-icons/md";
import { useUserInfo } from "@/hooks/user";

export function ProfileSetupDialog({ open, onOpenChange }: DialogProps) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [headerPhoto, setHeaderPhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);
  const headerPhotoRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [headerPhotoUrl, setHeaderPhotoUrl] = useState<string | null>(null);
  const { userInfo, isLoading } = useUserInfo();
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>,
    type: "photo" | "headerPhoto"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      setFile(URL.createObjectURL(file));

      if (type === "photo") setPhotoUrl(URL.createObjectURL(file));
      else setHeaderPhotoUrl(URL.createObjectURL(file));

      const uploadedUrl = await uploadFileToCloudinary(file);
      if (uploadedUrl) {
        if (type === "photo") {
          setPhotoUrl(uploadedUrl);
          setPhoto(uploadedUrl);
        } else if (type === "headerPhoto") {
          setHeaderPhotoUrl(uploadedUrl);
          setHeaderPhoto(uploadedUrl);
        }
      }
    }
  };

  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/api/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.result.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const setProfile = async () => {
    try {
      const res = await axios.post("/api/user/profile/create", {
        name: name !== "" ? name : userInfo.name,
        bio: bio !== "" ? bio : userInfo.bio,
        photo: photo ?? userInfo.photo,
        headerPhoto: headerPhoto ?? userInfo.headerPhoto,
      });
      await update({ name: name });
      toast({
        title: res.data.message || "Profile updated successfully",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: error?.response?.data.message || "Error updating profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[700px] bg-black text-white rounded-xl p-8 shadow-2xl">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-3xl font-extrabold text-center text-white bg-clip-text bg-black">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 text-center">
          <div
            onClick={() => headerPhotoRef?.current?.click()}
            className="relative w-full h-48 cursor-pointer bg-gray-600 rounded-lg overflow-hidden shadow-inner"
          >
            {(headerPhotoUrl || userInfo.headerPhoto) && (
              <img
                src={headerPhotoUrl || userInfo.headerPhoto}
                alt="Header Photo"
                className="h-full w-full object-cover cursor-pointer opacity-60"
              />
            )}
            <div className="flex justify-evenly">
              <MdAddAPhoto
                size={45}
                className="text-white absolute top-1/3 p-2 rounded-full bg-gray-800 shadow-lg"
              />
            </div>
            <Input
              onChange={(e) =>
                handleFileChange(e, setHeaderPhoto, "headerPhoto")
              }
              type="file"
              ref={headerPhotoRef}
              className="hidden"
            />
          </div>
          <div
            onClick={() => photoRef.current?.click()}
            className="flex justify-center relative h-32 w-32 -mt-16 rounded-full bg-gray-700 border-4 border-gray-800 shadow-lg cursor-pointer overflow-hidden"
          >
            {(photoUrl || userInfo.photo) && (
              <img
                src={photoUrl || userInfo.photo}
                alt="Profile Photo"
                className="h-full w-full rounded-full object-cover opacity-60"
              />
            )}
            <div>
              <MdAddAPhoto
                size={25}
                className="absolute top-14 left-11 hover:bg-white/15"
              />
            </div>
            <Input
              onChange={(e) => handleFileChange(e, setPhoto, "photo")}
              type="file"
              ref={photoRef}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="text-gray-400">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
              defaultValue={userInfo.name}
              className="bg-black rounded-lg text-white w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <div className="flex flex-col  gap-4">
            <Label htmlFor="bio" className="text-gray-400">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              defaultValue={userInfo.bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-black rounded-lg text-white w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>
        <Button
          onClick={setProfile}
          className="w-[80px] py-2 my-2 rounded-lg bg-white text-black font-bold hover:bg-white/85 transition-all duration-200 shadow-lg"
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
