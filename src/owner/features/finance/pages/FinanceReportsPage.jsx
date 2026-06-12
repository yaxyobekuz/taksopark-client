import useObjectState from "@/shared/hooks/useObjectState";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import StatCard from "@/shared/components/ui/card/StatCard";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";

import MonthSelect from "../components/MonthSelect";
import { useOverviewQuery } from "../hooks/useFinanceQueries";

const FinanceReportsPage = () => {
  const now = new Date();
  const { year, month, setFields } = useObjectState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { data, isLoading } = useOverviewQuery({ year, month });
  const payments = data?.payments || { planTotal: 0, paidTotal: 0 };
  const cashback = data?.cashback || { available: 0 };
  const deposit = data?.deposit || { total: 0 };
  const netDebt = data?.netDebt || 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Hisobotlar" description="Tanlangan oy bo'yicha umumiy moliyaviy manzara" />
      <MonthSelect year={year} month={month} onChange={setFields} />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <SkeletonStatCard count={5} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard label="Oylik reja" value={payments.planTotal} isMoney />
          <StatCard label="To'langan" value={payments.paidTotal} isMoney />
          <StatCard
            label="Sof qarz"
            hint="Depozit/keshbek bilan qoplangandan keyin"
            value={netDebt}
            isMoney
          />
          <StatCard label="Keshbek qoldig'i" value={cashback.available} isMoney />
          <StatCard label="Depozit balansi" value={deposit.total} isMoney />
        </div>
      )}
    </div>
  );
};

export default FinanceReportsPage;
