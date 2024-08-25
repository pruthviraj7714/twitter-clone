import { useRef, useState } from "react";
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
import { Avatar } from "@/components/ui/avatar";
import { DialogProps } from "@radix-ui/react-dialog";

export function ProfileSetupDialog({ open, onOpenChange }: DialogProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [headerPhoto, setHeaderPhoto] = useState("");
  const [bio, setBio] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);
  const headerPhotoRef = useRef<HTMLInputElement>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-black text-white rounded-lg p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 5 ? "Setup Complete" : "Setup your profile"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-400">
            {step !== 5 && "Follow the steps to complete your profile setup."}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Set Username */}
        {step === 1 && (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Name" className="text-right text-gray-300">
                Name
              </Label>
              <Input
                id="Name"
                placeholder="Name"
                className="col-span-3 bg-transparent rounded-lg text-white"
              />
            </div>
            <DialogFooter className="flex justify-end">
              <Button
                variant="outline"
                onClick={nextStep}
                className="bg-sky-500 hover:bg-sky-600 text-white hover:text-white rounded-full px-6 py-2"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Set Profile Photo */}
        {step === 2 && (
          <div className="grid gap-6 py-4 text-center">
            <Label className="text-gray-300">Profile Photo</Label>
            <div className="relative flex justify-center items-center">
              <div onClick={() => photoRef.current?.click()} className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <span className="text-white text-4xl">+</span>
                </div>
                <Input
                  type="file"
                  ref={photoRef}
                  className="hidden"
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-full px-6 py-2"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Set Header Photo */}
        {step === 3 && (
          <div className="grid gap-6 py-4 text-center">
            <Label className="text-gray-300">Header Photo</Label>
            <div className="relative flex justify-center items-center">
              <div onClick={() => headerPhotoRef?.current?.click()} className="relative w-[440px] h-[280px] bg-gray-700 flex items-center justify-center mx-auto cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 ">
                  <span className="text-white text-4xl">+</span>
                </div>
                <Input
                  type="file"
                  ref={headerPhotoRef}
                  className="hidden"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-6 py-2 mb-4"
            >
              Upload Header Photo
            </Button>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-full px-6 py-2"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 4: Add Bio */}
        {step === 4 && (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right text-gray-300">
                Bio
              </Label>
              <Input
                id="bio"
                placeholder="Tell us about yourself"
               className="col-span-3 bg-transparent rounded-lg text-white"
              />
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                className="bg-gray-600 hover:bg-gray-500 text-white rounded-full px-6 py-2"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={nextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2"
              >
                Complete
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 5: Setup Complete */}
        {step === 5 && (
          <div className="grid gap-6 py-4 text-center">
            <p className="text-xl text-gray-300">
              Your profile setup is complete!
            </p>
            <DialogFooter className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => []}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-2"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
