import SubscribeBox from "./SubscribeBox";
import WhotoFollowCard from "./WhotoFollowCard";

export default function RightSidebar() {

  return (
    <div className="flex flex-col justify-center items-center">
      <SubscribeBox />
      <WhotoFollowCard />
    </div>
  );
}
