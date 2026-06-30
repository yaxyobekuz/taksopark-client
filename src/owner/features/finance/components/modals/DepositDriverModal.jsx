import { useState } from "react";

import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";

import { useDepositDriverQuery } from "../../hooks/useFinanceQueries";
import { useDepositMovement, useDepositDelete } from "../../hooks/useFinanceMutations";
import LedgerList from "../LedgerList";

const DepositDriverModal = ({ driver }) => {
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const { data, isLoading } = useDepositDriverQuery(driver?._id);
  const balance = data?.balance || 0;
  const totalIn = data?.totalIn || 0;
  const totalOut = data?.totalOut || 0;
  const ledger = data?.ledger || [];

  const movement = useDepositMovement();
  const del = useDepositDelete();

  const [type, setType] = useState("in");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

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
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Jami kirim</p>
          <p className="text-sm font-semibold text-green-700">{formatMoney(totalIn)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Jami chiqim</p>
          <p className="text-sm font-semibold text-rose-700">{formatMoney(totalOut)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Depozit balansi</p>
          <p className="text-sm font-semibold">{formatMoney(balance)}</p>
        </div>
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

      <Card title="Depozit harakatlari">
        <div className="mt-3">
          <LedgerList
            ledger={ledger}
            canManage={canManage}
            deleting={del.isPending}
            onDelete={(e) => del.mutate(e.txId)}
          />
        </div>
      </Card>
    </div>
  );
};

export default DepositDriverModal;
