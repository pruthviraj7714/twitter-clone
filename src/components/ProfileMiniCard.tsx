import { Button } from "./ui/button";

export default function ProfileMiniCard() {
  return (
    <div className="flex justify-between items-center w-full p-2 border-b border-white/15 hover:bg-white/5 px-2">
      <div className="flex justify-start items-center gap-1.5">
        <div className="h-10 w-10 rounded-md">
          <img src="" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold">Name</h2>
          <p className="text-white/55">@username</p>
        </div>
      </div>
      <div onClick={() => {}}>
        {true ? (
          <Button className="rounded-full bg-black text-white font-semibold mt-2 border border-white/15">
            Following
          </Button>
        ) : (
          <Button className="rounded-full bg-white text-black font-semibold mt-2 hover:bg-white/85">
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}
