import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import { MONTHS } from "@/shared/constants/months";

import { useCategoryReportQuery } from "../hooks/useTransactions";
import CategoryReportChart from "../components/CategoryReportChart";
import CategoryList from "../components/CategoryList";

const pad = (n) => String(n).padStart(2, "0");

const CategoryReportPage = () => {
  const now = new Date();
  const { month, year, setField } = useObjectState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const yearOptions = useMemo(() => {
    const max = new Date().getFullYear();
    const list = [];
    for (let y = max; y >= max - 5; y--)
      list.push({ value: y, label: String(y) });
    return list;
  }, []);

  const fromDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  const { data, isLoading } = useCategoryReportQuery({ fromDate, toDate });

  const income = data?.income || [];
  const expense = data?.expense || [];
  const totalIncome = data?.totalIncome || 0;
  const totalExpense = data?.totalExpense || 0;

  return (
    <div className="space-y-4">
      <div className="-mx-4 px-4 py-3 bg-background border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Hisobot yuklanmoqda...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <CategoryReportChart
              title="Kirim"
              rows={income}
              total={totalIncome}
              tone="positive"
            />
            <CategoryReportChart
              title="Chiqim"
              rows={expense}
              total={totalExpense}
              tone="negative"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <CategoryList
              title="Kirim"
              rows={income}
              total={totalIncome}
              tone="positive"
            />
            <CategoryList
              title="Chiqim"
              rows={expense}
              total={totalExpense}
              tone="negative"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryReportPage;
