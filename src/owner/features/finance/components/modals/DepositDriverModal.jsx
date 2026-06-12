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
import AccountBreakdown from "../AccountBreakdown";

const TYPE_LABELS = { in: "Kirim", out: "Chiqim" };

const DepositDriverModal = ({ driver }) => {
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const { data, isLoading } = useDepositDriverQuery(driver?._id);
  const balance = data?.balance || 0;
  const debt = data?.debt || 0;
  const account = data?.account || null;
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
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border p-3 text-center">
          <p className="text-[11px] text-muted-foreground">Depozit balansi</p>
          <p className="text-lg font-semibold">{formatMoney(balance)}</p>
        </div>
        <div className="rounded-lg border p-3 text-center">
          <p className="text-[11px] text-muted-foreground">Qarz</p>
          <p className="text-lg font-semibold">{formatMoney(debt)}</p>
        </div>
      </div>

      <AccountBreakdown account={account} />

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

export default DepositDriverModal;
