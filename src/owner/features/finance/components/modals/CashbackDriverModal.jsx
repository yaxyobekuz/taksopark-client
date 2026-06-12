import { useState } from "react";
import { Undo2 } from "lucide-react";

import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";

import { useCashbackDriverQuery } from "../../hooks/useFinanceQueries";
import { useCashbackPayout, useCashbackReverse } from "../../hooks/useFinanceMutations";

const monthRange = (m) => `${formatDateUZ(m.monthStart)} – ${formatDateUZ(m.monthEnd)}`;

const CashbackDriverModal = ({ driver }) => {
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const { data, isLoading } = useCashbackDriverQuery(driver?._id);
  const months = data?.months || [];
  const totals = data?.totals || { accrued: 0, paidOut: 0, available: 0 };
  const transactions = data?.transactions || [];

  const payout = useCashbackPayout();
  const reverse = useCashbackReverse();

  const payable = months.filter((m) => m.available > 0);
  const [monthStart, setMonthStart] = useState("");
  const [amount, setAmount] = useState("");

  const reversedIds = new Set(transactions.filter((t) => t.reverses).map((t) => String(t.reverses)));

  const handlePayout = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!monthStart || !value) return;
    payout.mutate(
      { driverId: driver._id, monthStart, amount: value },
      { onSuccess: () => { setAmount(""); setMonthStart(""); } },
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Hisoblangan</p>
          <p className="text-sm font-semibold">{formatMoney(totals.accrued)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">To'langan</p>
          <p className="text-sm font-semibold">{formatMoney(totals.paidOut)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Qoldiq</p>
          <p className="text-sm font-semibold">{formatMoney(totals.available)}</p>
        </div>
      </div>

      {canManage && payable.length > 0 && (
        <form onSubmit={handlePayout} className="space-y-2 border-t pt-3">
          <SelectField
            label="Keshbek oyi"
            value={monthStart}
            onChange={setMonthStart}
            options={[
              { value: "", label: "- Oyni tanlang -" },
              ...payable.map((m) => ({
                value: new Date(m.monthStart).toISOString(),
                label: `${monthRange(m)} (qoldiq: ${formatMoney(m.available)})`,
              })),
            ]}
          />
          <div className="flex items-end gap-2">
            <InputField
              label="To'lov summasi"
              type="price"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              disabled={payout.isPending}
            />
            <Button type="submit" disabled={payout.isPending || !monthStart || !Number(amount)}>
              To'lash
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Keshbek oylari</p>
        {months.length === 0 ? (
          <EmptyState title="Keshbek oyi yo'q" />
        ) : (
          <div className="space-y-1.5">
            {months.map((m) => (
              <div key={new Date(m.monthStart).toISOString()} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">{monthRange(m)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.isComplete ? "Yakunlangan" : "Joriy"} · {m.daysInMonth} kun
                  </p>
                </div>
                <div className="text-right text-xs shrink-0">
                  <p>Hisoblangan: {formatMoney(m.accrued)}</p>
                  <p className="text-muted-foreground">Qoldiq: {formatMoney(m.available)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">To'lovlar</p>
          <div className="space-y-1.5">
            {transactions.map((t) => {
              const isReversed = reversedIds.has(String(t._id));
              const isReversal = t.type === "reversal";
              return (
                <div key={t._id} className={`flex items-center justify-between gap-2 rounded-md border p-2 text-sm ${isReversal || isReversed ? "opacity-60" : ""}`}>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {isReversal ? "−" : ""}{formatMoney(t.amount)}
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        {isReversal ? "Bekor qilingan" : "To'lov"}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">{formatDateUZ(t.createdAt)}</p>
                  </div>
                  {canManage && !isReversal && !isReversed && (
                    <button
                      type="button"
                      onClick={() => reverse.mutate(t._id)}
                      disabled={reverse.isPending}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 shrink-0"
                      title="Bekor qilish"
                    >
                      <Undo2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CashbackDriverModal;
