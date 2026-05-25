import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { TrendingUp, AlertTriangle, Wrench, Wallet, Scale } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import StatCard from "@/shared/components/ui/card/StatCard";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import { formatMoney } from "@/shared/utils/formatMoney";
import { cn } from "@/shared/utils/cn";

import { useCarFinanceQuery } from "../hooks/useCarFinanceQuery";

const MONTHS = [
  { value: 1, label: "Yanvar" },
  { value: 2, label: "Fevral" },
  { value: 3, label: "Mart" },
  { value: 4, label: "Aprel" },
  { value: 5, label: "May" },
  { value: 6, label: "Iyun" },
  { value: 7, label: "Iyul" },
  { value: 8, label: "Avgust" },
  { value: 9, label: "Sentabr" },
  { value: 10, label: "Oktabr" },
  { value: 11, label: "Noyabr" },
  { value: 12, label: "Dekabr" },
];

const pad = (n) => String(n).padStart(2, "0");

const CarFinancePage = () => {
  const { id } = useParams();
  const now = new Date();
  const { month, year, setField } = useObjectState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const yearOptions = useMemo(() => {
    const max = new Date().getFullYear();
    const list = [];
    for (let y = max; y >= max - 5; y--) list.push({ value: y, label: String(y) });
    return list;
  }, []);

  const fromDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  const { data, isLoading } = useCarFinanceQuery({ carId: id, fromDate, toDate });

  const row = data?.rows?.[0] || {
    revenue: 0,
    fines: 0,
    damages: 0,
    salary: 0,
    profit: 0,
  };

  const profitPositive = row.profit >= 0;

  return (
    <div className="space-y-4">
      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b">
        <div className="grid grid-cols-2 gap-3">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonStatCard count={4} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Daromad" value={row.revenue} icon={TrendingUp} tone="positive" isMoney />
            <StatCard label="Jarima" value={row.fines} icon={AlertTriangle} tone="negative" isMoney />
            <StatCard label="Zarar" value={row.damages} icon={Wrench} tone="negative" isMoney />
            <StatCard label="Oylik" value={row.salary} icon={Wallet} tone="negative" isMoney />
          </div>

          <div
            className={cn(
              "rounded-[2px] border p-5 flex items-center justify-between gap-4",
              profitPositive
                ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200"
                : "bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200",
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-full shrink-0",
                  profitPositive
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white",
                )}
              >
                <Scale size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sof foyda</p>
                <p
                  className={cn(
                    "text-2xl font-bold tracking-tight",
                    profitPositive ? "text-emerald-700" : "text-rose-700",
                  )}
                >
                  <AnimatedCounter
                    value={row.profit}
                    formatter={formatMoney}
                  />
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CarFinancePage;
