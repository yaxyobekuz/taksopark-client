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

import { useDepositDriverQuery } from "../../hooks/useFinanceQueries";
import { useDepositMovement, useDepositReverse } from "../../hooks/useFinanceMutations";

const TYPE_LABELS = { in: "Kirim", out: "Chiqim" };

const DepositDriverModal = ({ driver }) => {
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const { data, isLoading } = useDepositDriverQuery(driver?._id);
  const balance = data?.balance || 0;
  const transactions = data?.transactions || [];

  const movement = useDepositMovement();
  const reverse = useDepositReverse();

  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const reversedIds = new Set(transactions.filter((t) => t.reverses).map((t) => String(t.reverses)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value) return;
    movement.mutate(
      { driverId: driver._id, type, amount: value, note },
      { onSuccess: () => { setAmount(""); setNote(""); } },
    );
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3 text-center">
        <p className="text-[11px] text-muted-foreground">Depozit balansi</p>
        <p className="text-lg font-semibold">{formatMoney(balance)}</p>
      </div>

      {canManage && (
        <form onSubmit={handleSubmit} className="space-y-2 border-t pt-3">
          <div className="flex items-end gap-2">
            <SelectField
              label="Harakat"
              value={type}
              onChange={setType}
              options={[
                { value: "in", label: "Kirim" },
                { value: "out", label: "Chiqim" },
              ]}
              className="w-32"
            />
            <InputField
              label="Summa"
              type="price"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              disabled={movement.isPending}
            />
            <Button type="submit" disabled={movement.isPending || !Number(amount)}>
              Yozish
            </Button>
          </div>
          <InputField
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Izoh (ixtiyoriy)"
            disabled={movement.isPending}
          />
        </form>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Harakatlar</p>
        {transactions.length === 0 ? (
          <EmptyState title="Harakat yo'q" />
        ) : (
          <div className="space-y-1.5">
            {transactions.map((t) => {
              const isReversed = reversedIds.has(String(t._id));
              const isReversal = !!t.reverses;
              return (
                <div key={t._id} className={`flex items-center justify-between gap-2 rounded-md border p-2 text-sm ${isReversed || isReversal ? "opacity-60" : ""}`}>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {t.type === "out" ? "−" : "+"}{formatMoney(t.amount)}
                      <span className="ml-2 text-[11px] text-muted-foreground">{TYPE_LABELS[t.type] || t.type}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDateUZ(t.createdAt)}{t.note ? ` · ${t.note}` : ""}
                    </p>
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
        )}
      </div>
    </div>
  );
};

export default DepositDriverModal;
