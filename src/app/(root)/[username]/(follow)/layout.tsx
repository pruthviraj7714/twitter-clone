import FollowTab from "@/components/FollowTab";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col justify-center h-full">
      <div className="w-full">
        <FollowTab />
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
}
