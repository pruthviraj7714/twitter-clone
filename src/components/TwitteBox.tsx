"use client";
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import EmojiPicker, { Theme } from "emoji-picker-react";

export default function Twitte({
  username,
  photo,
}: {
  username: string;
  photo: string;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const router = useRouter();

  const { toast } = useToast();

  const addEmoji = (emojiObject: any) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const maxLength = 200;
  const percentage = Math.min((text.length / maxLength) * 100, 100);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileType(file.type.startsWith("video") ? "video" : "image");
      setSelectedFile(file);
      setMediaUrl(URL.createObjectURL(file));
    }
  };

  const createPost = async () => {
    try {
      setUploading(true);
      let mediaUrl: string | null = null;

      if (selectedFile) {
        mediaUrl = await uploadFileToCloudinary(selectedFile);
      }

      const payload = {
        text,
        image: fileType === "image" ? mediaUrl : undefined,
        video: fileType === "video" ? mediaUrl : undefined,
      };

      const res = await axios.post("/api/post/create", payload);

      if (res.status === 201) {
        toast({
          title: "Post created successfully!",
        });
        setText("");
        setSelectedFile(null);
        setFileType(null);
        setMediaUrl(null);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        router.refresh();
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error: any) {
      toast({
        title: error.response?.data?.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadFileToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        fileType === "image" ? "/api/upload/image" : "/api/upload/video",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMediaUrl(response.data.result.url);
      return response.data.result.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setMediaUrl(null);
  };

  return (
    <div className="w-full flex-1 h-auto p-4 border-b border-gray-700">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-600 flex justify-center items-center text-white">
          {photo ? (
            <img
              src={photo}
              alt="Profile Photo"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            username && username.length > 0 && username.charAt(0).toUpperCase()
          )}
        </div>
        <textarea
          ref={textareaRef}
          className="bg-transparent mt-1 text-white text-lg placeholder-gray-500 w-full h-auto outline-none resize-none"
          placeholder="What's happening?"
          autoFocus
          value={text}
          onChange={handleTextChange}
          style={{
            minHeight: "24px",
            maxHeight: "720px",
            overflow: "hidden",
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-4 text-sky-400">
          <ImageIcon
            onClick={() => filePickerRef.current?.click()}
            className="cursor-pointer hover:text-sky-500"
          />
          <input
            type="file"
            ref={filePickerRef}
            hidden
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <SmileIcon
            className="cursor-pointer hover:text-sky-500"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {showEmojiPicker && (
            <div className="absolute top-10">
              <EmojiPicker
                className="z-20"
                theme={Theme.DARK}
                onEmojiClick={addEmoji}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {text.length >= maxLength ? (
            <div className="h-10 w-10 border-2 text-xs p-1 font-sans border-red-500 text-red-500 flex justify-center items-center">
              {`-${text.length - maxLength}`}
            </div>
          ) : (
            <div
              className="relative h-10 w-10 flex items-center justify-center font-sans text-xs p-1"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderRadius: "50%",
                borderImage: `conic-gradient(skyblue ${percentage}%, gray ${percentage}%) 1`,
              }}
            >
              {maxLength - text.length}
            </div>
          )}
          <Button
            onClick={createPost}
            disabled={text.length === 0}
            className="rounded-full bg-sky-400 hover:bg-sky-500 px-5 py-2 text-white font-semibold"
          >
            {uploading ? "Uploading..." : "Post"}
          </Button>
        </div>
      </div>

      {mediaUrl && (
        <div className="relative mt-4">
          <XIcon
            className="cursor-pointer absolute right-3 top-3 z-10 bg-gray-800 text-white rounded-full p-1"
            onClick={removeSelectedFile}
          />
          {fileType === "image" ? (
            <img
              src={mediaUrl}
              alt="Selected"
              className="w-full object-contain rounded-lg"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              className="w-full object-contain rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
}
