// Router
import { Outlet } from "react-router-dom";

// Components
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/shadcn/sidebar";
import AppHeader from "@/shared/components/layout/AppHeader";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import BottomNavbar from "@/shared/components/ui/navbar/BottomNavbar";

const DashboardLayout = () => (
  <SidebarProvider className="relative z-10">
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 pb-20 md:py-2 md:pb-2">
        <Outlet />
      </div>
      <BottomNavbar />
    </SidebarInset>
  </SidebarProvider>
);

export default DashboardLayout;
