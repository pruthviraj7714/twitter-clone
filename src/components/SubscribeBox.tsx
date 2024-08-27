import { Button } from "./ui/button";

export default function SubscribeBox() {
  return (
    <div className="flex flex-col justify-center items-center border border-white/15 rounded-xl p-3">
      <div className="flex flex-col space-y-3">
        <h1 className="font-extrabold text-xl">Subscribe to Premium</h1>
        <p>
          Subscribe to unlock new features and if eligible, receive a share of
          ads revenue.
        </p>
        <Button className="w-[120px] bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
