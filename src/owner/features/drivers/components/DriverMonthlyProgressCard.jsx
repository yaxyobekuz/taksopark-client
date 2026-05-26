import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import StatCard from "@/shared/components/ui/card/StatCard";
import ProgressBar from "@/shared/components/ui/progress/ProgressBar";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import { MONTHS } from "@/shared/constants/months";
import {
  useDepositDriversMonthlyQuery,
  useReportsMinYearQuery,
} from "@/owner/features/payments";

const DriverMonthlyProgressCard = ({ driverId }) => {
  const now = useMemo(() => new Date(), []);
  const { month, year, setField } = useObjectState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const { data: minYearData } = useReportsMinYearQuery();
  const { data, isLoading } = useDepositDriversMonthlyQuery({
    year,
    month,
    driverId,
  });

  const yearOptions = useMemo(() => {
    const min = minYearData?.year || now.getFullYear();
    const max = now.getFullYear();
    const list = [];
    for (let y = max; y >= min; y--) list.push({ value: y, label: String(y) });
    return list;
  }, [minYearData?.year, now]);

  const row = data?.rows?.[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <SelectField
          label="Oy"
          value={month}
          onChange={(v) => setField("month", Number(v))}
          options={MONTHS}
        />
        <SelectField
          label="Yil"
          value={year}
          onChange={(v) => setField("year", Number(v))}
          options={yearOptions}
        />
      </div>

      {isLoading ? (
        <SkeletonCard count={1} />
      ) : !row ? (
        <p className="text-sm text-muted-foreground">
          Tanlangan oy uchun ma'lumot yo'q.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard
              label="Kutilayotgan"
              value={row.expected}
              isMoney
              tone="info"
            />
            <StatCard
              label="To'langan"
              value={row.paid}
              isMoney
              tone="positive"
            />
            <StatCard
              label="Qarz"
              value={row.debt}
              isMoney
              tone={row.debt > 0 ? "negative" : "default"}
            />
          </div>
          <div className="flex items-center gap-3">
            <ProgressBar value={row.percent} />
            <span className="text-sm font-semibold tabular-nums shrink-0">
              {row.percent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMonthlyProgressCard;
