import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";

const TransactionsSummaryCards = ({ summary }) => {
  const byWallet = summary?.byWallet || {};
  let income = 0;
  let expense = 0;
  for (const w of Object.values(byWallet)) {
    income += w.in || 0;
    expense += w.out || 0;
  }
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard label="Kirim" value={income} icon={ArrowDownCircle} tone="positive" isMoney />
      <StatCard label="Chiqim" value={expense} icon={ArrowUpCircle} tone="negative" isMoney />
      <StatCard
        label="Qoldiq"
        value={balance}
        icon={Wallet}
        tone={balance >= 0 ? "positive" : "negative"}
        isMoney
      />
    </div>
  );
};

export default TransactionsSummaryCards;
