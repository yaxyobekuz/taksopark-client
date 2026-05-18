import { Outlet } from "react-router-dom";
import usePermissions from "@/shared/hooks/usePermissions";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import { PERMISSIONS } from "@/shared/constants/permissions";

const PaymentsLayout = () => {
  const { has } = usePermissions();

  const tabs = [{ to: "/owner/payments", label: "Asosiy", exact: true }];

  if (has(PERMISSIONS.REPORTS_READ)) {
    tabs.push(
      { to: "/owner/payments/reports/daily-plan", label: "Kunlik reja" },
      { to: "/owner/payments/reports/finance", label: "Statistika" },
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">To'lovlar</h1>
      <TabsLinks items={tabs} />
      <Outlet />
    </div>
  );
};

export default PaymentsLayout;
