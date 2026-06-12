import { useState } from "react";

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
import AccountBreakdown from "../AccountBreakdown";
import LedgerList from "../LedgerList";

const monthRange = (m) => `${formatDateUZ(m.monthStart)} – ${formatDateUZ(m.monthEnd)}`;

const CashbackDriverModal = ({ driver }) => {
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const { data, isLoading } = useCashbackDriverQuery(driver?._id);
  const months = data?.months || [];
  const totals = data?.totals || { accrued: 0, paidOut: 0, available: 0 };
  const accountDebt = data?.accountDebt || 0;
  const account = data?.account || null;
  const ledger = data?.ledger || [];

  const payout = useCashbackPayout();
  const reverse = useCashbackReverse();

  const payable = months.filter((m) => m.available > 0);
  const [monthStart, setMonthStart] = useState("");
  const [amount, setAmount] = useState("");

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
          <p className="text-[11px] text-muted-foreground">To'lash mumkin</p>
          <p className="text-sm font-semibold">{formatMoney(totals.available)}</p>
        </div>
      </div>

      {accountDebt > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">
          Haydovchining qarzi bor ({formatMoney(accountDebt)}) — keshbek avval qarzni
          qoplaydi, shuning uchun to'lash mumkin bo'lgan summa cheklangan.
        </p>
      )}

      <AccountBreakdown account={account} />

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

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Harakatlar tarixi</p>
        <LedgerList
          ledger={ledger}
          canManage={canManage}
          reversing={reverse.isPending}
          onReverse={(e) => reverse.mutate(e.txId)}
        />
      </div>
    </div>
  );
};

export default CashbackDriverModal;
