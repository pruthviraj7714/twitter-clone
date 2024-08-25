import { useState } from "react";
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

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white rounded-lg p-6">
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
              <Label htmlFor="username" className="text-right text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="@username"
                className="col-span-3 bg-[#2F3136] border-none rounded-lg text-white"
              />
            </div>
            <DialogFooter className="flex justify-end">
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

        {/* Step 2: Set Profile Photo */}
        {step === 2 && (
          <div className="grid gap-6 py-4 text-center">
            <Label className="text-gray-300">Profile Photo</Label>
            <Avatar className="h-24 w-24 mb-4 rounded-full mx-auto" />
            <Button
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full px-6 py-2 mb-4"
            >
              Upload Photo
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

        {/* Step 3: Set Header Photo */}
        {step === 3 && (
          <div className="grid gap-6 py-4 text-center">
            <Label className="text-gray-300">Header Photo</Label>
            <Avatar className="h-32 w-full mb-4 rounded-md mx-auto" /> 
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
                className="col-span-3 bg-[#2F3136] border-none rounded-lg text-white"
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
            <p className="text-xl text-gray-300">Your profile setup is complete!</p>
            <DialogFooter className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {}}
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
