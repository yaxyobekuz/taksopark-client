import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { formatMoney } from "@/shared/utils/formatMoney";

const Card = ({ icon: Icon, label, value, color }) => (
  <div className={`rounded-lg border p-4 bg-white space-y-1 ${color}`}>
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon size={16} /> {label}
    </div>
    <div className="text-xl font-semibold">{formatMoney(value)}</div>
  </div>
);

const TransactionsSummaryCards = ({ summary }) => {
  const income = summary?.income || 0;
  const expense = summary?.expense || 0;
  const balance = summary?.balance || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card icon={ArrowDownCircle} label="Kirim" value={income} color="border-green-200" />
      <Card icon={ArrowUpCircle} label="Chiqim" value={expense} color="border-red-200" />
      <Card icon={Wallet} label="Qoldiq" value={balance} color={balance >= 0 ? "border-green-200" : "border-red-200"} />
    </div>
  );
};

export default TransactionsSummaryCards;
