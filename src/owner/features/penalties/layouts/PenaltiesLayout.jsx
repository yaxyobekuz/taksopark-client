import { Outlet } from "react-router-dom";
import usePermissions from "@/shared/hooks/usePermissions";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
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
      <h1 className="text-2xl font-semibold">Jarima & Zarar</h1>
      <TabsLinks items={tabs} />
      <Outlet />
    </div>
  );
};

export default PenaltiesLayout;
