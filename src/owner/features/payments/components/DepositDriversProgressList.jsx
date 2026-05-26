import { Users } from "lucide-react";

import StatCard from "@/shared/components/ui/card/StatCard";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import { useDepositDriversMonthlyQuery } from "../hooks/useReportsQuery";
import DepositDriverProgressRow from "./DepositDriverProgressRow";

const DepositDriversProgressList = ({ year, month }) => {
  const { data, isLoading } = useDepositDriversMonthlyQuery({ year, month });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <SkeletonCard count={4} />
      </div>
    );
  }

  const rows = data?.rows || [];
  const totals = data?.totals || { expected: 0, paid: 0, debt: 0 };

  if (!rows.length) {
    return (
      <EmptyState
        icon={Users}
        title="Depozitli haydovchi yo'q"
        description="Tanlangan oyda depozitli faol haydovchi topilmadi"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Jami kutilayotgan" value={totals.expected} isMoney tone="info" />
        <StatCard label="Jami to'langan" value={totals.paid} isMoney tone="positive" />
        <StatCard label="Jami qarz" value={totals.debt} isMoney tone="negative" />
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <DepositDriverProgressRow key={row.driverId} row={row} />
        ))}
      </div>
    </div>
  );
};

export default DepositDriversProgressList;
