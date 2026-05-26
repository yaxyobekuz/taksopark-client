import { useMemo } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import { MONTHS } from "@/shared/constants/months";
import { useCarsQuery } from "@/owner/features/cars";
import {
  useFinanceReportQuery,
  useReportsMinYearQuery,
} from "../hooks/useReportsQuery";
import FinanceMatrix from "../components/FinanceMatrix";

const pad = (n) => String(n).padStart(2, "0");

const FinanceReportPage = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { month, year, carId, setField } = useObjectState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    carId: "",
  });

  const { data: carsData } = useCarsQuery({ limit: 500 });
  const { data: minYearData } = useReportsMinYearQuery();

  const carOptions = [
    { value: "", label: "Barcha mashinalar" },
    ...(carsData?.data || []).map((c) => ({
      value: c._id,
      label: `${c.plateNumber} - ${c.model}`,
    })),
  ];

  const yearOptions = useMemo(() => {
    const min = minYearData?.year || currentYear;
    const max = currentYear;
    const list = [];
    for (let y = max; y >= min; y--) list.push({ value: y, label: String(y) });
    return list;
  }, [minYearData?.year, currentYear]);

  const fromDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  const { data, isLoading } = useFinanceReportQuery({
    fromDate,
    toDate,
    carId: carId || undefined,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tanlangan oy uchun har bir mashina bo'yicha daromad, jarima, zarar,
        oylik va sof foyda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectField
          label="Mashina"
          value={carId}
          onChange={(v) => setField("carId", v)}
          options={carOptions}
        />
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
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      ) : (
        <FinanceMatrix data={data} />
      )}
    </div>
  );
};

export default FinanceReportPage;
