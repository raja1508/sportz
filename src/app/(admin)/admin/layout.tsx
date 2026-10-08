import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: {children: React.ReactNode}) {
    return (
      <div className="page-admin">   {/* flex, height: 100vh, overflow: hidden */}
        <Sidebar />
        {children}                   {/* AdminDashboard handles its own scroll */}
      </div>
    );
  }