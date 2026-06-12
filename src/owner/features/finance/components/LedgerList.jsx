import { Undo2 } from "lucide-react";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";

// Balansga ta'sir qilgan barcha harakatlar (statement) - sana, izoh, summa va
// yugurib boruvchi balans bilan. reversible yozuvlarda bekor qilish tugmasi.
const LedgerList = ({ ledger = [], canManage, onReverse, reversing }) => {
  if (!ledger.length) return <EmptyState title="Harakat yo'q" />;

  return (
    <div className="space-y-1.5">
      {ledger.map((e, i) => {
        const positive = e.amount > 0;
        return (
          <div
            key={e.txId || `${e.kind}-${i}`}
            className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {e.label}
                {e.note ? <span className="text-muted-foreground font-normal"> · {e.note}</span> : null}
              </p>
              <p className="text-[11px] text-muted-foreground">{formatDateUZ(e.date)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-right">
              <div>
                <p className={`tabular-nums font-medium ${positive ? "text-green-700" : "text-rose-700"}`}>
                  {positive ? "+" : "−"}
                  {formatMoney(Math.abs(e.amount))}
                </p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  balans: {formatMoney(e.balance)}
                </p>
              </div>
              {canManage && e.reversible && e.txId && (
                <button
                  type="button"
                  onClick={() => onReverse(e)}
                  disabled={reversing}
                  className="p-1.5 text-muted-foreground hover:text-rose-600"
                  title="Bekor qilish"
                >
                  <Undo2 size={15} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LedgerList;
