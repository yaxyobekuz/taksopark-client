import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import { MONTHS } from "@/shared/constants/months";

import { useReportsMinYearQuery } from "../hooks/useReportsQuery";
import DepositDriversProgressList from "../components/DepositDriversProgressList";

const MonthlyPlanReportPage = () => {
  const now = useMemo(() => new Date(), []);
  const { month, year, setField } = useObjectState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const { data: minYearData } = useReportsMinYearQuery();

  const yearOptions = useMemo(() => {
    const min = minYearData?.year || now.getFullYear();
    const max = now.getFullYear();
    const list = [];
    for (let y = max; y >= min; y--) list.push({ value: y, label: String(y) });
    return list;
  }, [minYearData?.year, now]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tanlangan oy bo'yicha har bir depozitli haydovchidan kutilayotgan,
        to'langan va qarz summalari.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
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

      <DepositDriversProgressList year={year} month={month} />
    </div>
  );
};

export default MonthlyPlanReportPage;
