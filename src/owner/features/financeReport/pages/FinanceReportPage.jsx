import { useMemo } from "react";
import { Wallet, AlertTriangle, TrendingUp, ArrowLeftRight } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import { MONTHS } from "@/shared/constants/months";
import { TRANSACTION_WALLETS } from "@/shared/constants/payments";
import { useFinanceOverviewQuery } from "../hooks/useFinanceReport";
import WalletCard from "../components/WalletCard";

const pad = (n) => String(n).padStart(2, "0");

const WALLET_ICONS = {
  [TRANSACTION_WALLETS.DEPOSIT]: Wallet,
  [TRANSACTION_WALLETS.DEBT]: AlertTriangle,
  [TRANSACTION_WALLETS.REVENUE]: TrendingUp,
  [TRANSACTION_WALLETS.EXTERNAL]: ArrowLeftRight,
};

const FinanceReportPage = () => {
  const now = new Date();
  const { month, year, setFields } = useObjectState({
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

  const { data, isLoading } = useFinanceOverviewQuery({ fromDate, toDate });
  const wallets = data?.wallets || {};

  return (
    <div className="space-y-4">
      <div className="-mx-4 px-4 py-3 bg-background border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-md">
          <SelectField
            label="Oy"
            value={month}
            onChange={(v) => setFields({ month: Number(v) })}
            options={MONTHS}
          />
          <SelectField
            label="Yil"
            value={year}
            onChange={(v) => setFields({ year: Number(v) })}
            options={yearOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(TRANSACTION_WALLETS).map((w) => (
            <WalletCard
              key={w}
              wallet={w}
              data={wallets[w]}
              icon={WALLET_ICONS[w]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FinanceReportPage;
