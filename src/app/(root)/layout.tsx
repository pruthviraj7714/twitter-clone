import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="flex justify-evenly h-full">
        <div className="fixed left-0 top-0 w-[250px] px-4 hidden md:block h-full">
          <Sidebar />
        </div>

        <div className="flex-1 max-w-[600px] px-4 h-full lg:ml-[200px] lg:mr-[330px]">
          {children}
        </div>

        <div className="fixed right-14 top-14 w-[390px] hidden lg:block px-4 h-full">
          <RightSidebar />
        </div>
      </div>
    </section>
  );
}
