import Sidebar from "@/components/Sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="flex justify-center h-full">
        {/* Left Sidebar */}
        <div className="fixed left-0 top-0 w-[250px] px-4 hidden lg:block h-full">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 max-w-[600px] px-4 h-full lg:ml-[200px] lg:mr-[330px]">
          {children}
        </div>
        {/* Right Sidebar */}
        <div className="fixed right-0 top-0 w-[330px] hidden lg:block px-4 h-full">
          Right Sidebar
        </div>
      </div>
    </section>
  );
}
