import { Outlet } from "react-router-dom";

import usePermissions from "@/shared/hooks/usePermissions";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import { PERMISSIONS } from "@/shared/constants/permissions";

const PenaltiesLayout = () => {
  const { has } = usePermissions();

  const tabs = [];
  if (has(PERMISSIONS.FINES_READ)) {
    tabs.push({ to: "/owner/penalties", label: "Jarimalar", exact: true });
  }
  if (has(PERMISSIONS.DAMAGES_READ)) {
    tabs.push({ to: "/owner/penalties/damages", label: "Zararlar" });
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Jarima & Zarar" />

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-2 bg-background border-b">
        <TabsLinks
          items={tabs}
          listClassName="overflow-x-auto scrollbar-hide"
        />
      </div>

      <Outlet />
    </div>
  );
};

export default PenaltiesLayout;
