import { Outlet } from "react-router-dom";

import usePermissions from "@/shared/hooks/usePermissions";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
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
      <PageHeader title="To'lovlar" />

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

export default PaymentsLayout;
