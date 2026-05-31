// Router
import { Outlet } from "react-router-dom";

// Components
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/shadcn/sidebar";
import AppHeader from "@/shared/components/layout/AppHeader";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import GlobalSearchModal from "@/shared/components/layout/GlobalSearchModal";
import BottomNavbar from "@/shared/components/ui/navbar/BottomNavbar";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { MyPasswordModal } from "@/owner/features/admins";

// Hooks
import useGlobalSearchHotkey from "@/shared/hooks/useGlobalSearchHotkey";

const DashboardLayout = () => {
  useGlobalSearchHotkey();

  return (
    <SidebarProvider className="relative z-10">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pb-20 md:py-2 md:pb-2">
          <Outlet />
        </div>
        <BottomNavbar />
      </SidebarInset>
      <ModalWrapper name={MODAL.MY_PASSWORD} title="Parolni o'zgartirish" className="max-w-md">
        <MyPasswordModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.GLOBAL_SEARCH} title="Tezkor qidiruv" className="max-w-xl">
        <GlobalSearchModal />
      </ModalWrapper>
    </SidebarProvider>
  );
};

export default DashboardLayout;
