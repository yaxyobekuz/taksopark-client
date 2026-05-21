import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import {
  TRANSACTION_TYPES,
  TRANSACTION_SOURCE_LABELS,
  TRANSACTION_SOURCES,
} from "@/shared/constants/payments";
import { useTransactionDelete } from "../hooks/useTransactions";

const TransactionsTable = ({ items = [] }) => {
  const { has } = usePermissions();
  const deleteMutation = useTransactionDelete();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Tranzaksiya yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Turi</th>
            <th className="text-left p-3">Manba</th>
            <th className="text-left p-3">Kategoriya</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-right p-3">Summa</th>
            <th className="text-left p-3">Izoh</th>
            <th className="text-right p-3"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => {
            const isIncome = t.type === TRANSACTION_TYPES.INCOME;
            return (
              <tr key={t._id} className="border-t">
                <td className="p-3">{formatDateUZ(t.date)}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 ${isIncome ? "text-green-700" : "text-red-700"}`}>
                    {isIncome ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                    {isIncome ? "Kirim" : "Chiqim"}
                  </span>
                </td>
                <td className="p-3 text-xs text-muted-foreground">{TRANSACTION_SOURCE_LABELS[t.source]}</td>
                <td className="p-3">{t.category || "-"}</td>
                <td className="p-3">{t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : "-"}</td>
                <td className={`p-3 text-right font-medium ${isIncome ? "text-green-700" : "text-red-700"}`}>
                  {isIncome ? "+" : "-"}{formatMoney(t.amount)}
                </td>
                <td className="p-3 text-muted-foreground">{t.note || "-"}</td>
                <td className="p-3 text-right">
                  {has(PERMISSIONS.TRANSACTIONS_DELETE) && t.source === TRANSACTION_SOURCES.MANUAL && (
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(t._id)}
                      disabled={deleteMutation.isPending}
                      className="text-muted-foreground hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
