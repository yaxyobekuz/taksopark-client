import { useState } from "react";

import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { usePaymentCreate } from "@/owner/features/drivers";

// Jadval qatoridagi aniq haydovchi + kun uchun tezkor to'lov qo'shish.
const QuickPaymentModal = ({ close, plan }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const create = usePaymentCreate();

  if (!plan) return null;

  const driverName = plan.driver
    ? `${plan.driver.firstName} ${plan.driver.lastName || ""}`.trim()
    : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value) return;
    create.mutate(
      { dailyPlanId: plan._id, amount: value, note },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Haydovchi</span>
          <span className="font-medium">{driverName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sana</span>
          <span className="font-medium">{formatDateUZ(plan.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Kunlik reja</span>
          <span className="font-medium">{formatMoney(plan.planAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Qoldiq qarz</span>
          <span className="font-medium">{formatMoney(plan.debt)}</span>
        </div>
      </div>

      <InputField
        label="To'lov summasi"
        type="price"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        disabled={create.isPending}
      />
      <InputField
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Izoh (ixtiyoriy)"
        disabled={create.isPending}
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={create.isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={!Number(amount) || create.isPending}>
          {create.isPending ? "Saqlanmoqda..." : "To'lov qo'shish"}
        </Button>
      </div>
    </form>
  );
};

export default QuickPaymentModal;
