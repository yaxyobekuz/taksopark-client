import { useState } from "react";

import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import {
  useDriversQuery,
  usePaymentsMonthQuery,
  usePaymentCreate,
} from "@/owner/features/drivers";

const driverLabel = (d) =>
  `${d.firstName} ${d.lastName || ""}`.trim() + (d.phone ? ` (${d.phone})` : "");

const todayStr = () => new Date().toISOString().slice(0, 10);

const AddPaymentModal = ({ close }) => {
  const [driverId, setDriverId] = useState("");
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const { data: driversData } = useDriversQuery({ limit: 500 });
  const drivers = driversData?.data || [];

  // Tanlangan sanadan oy aniqlanadi va o'sha oy planlari yuklanadi.
  const [yStr, mStr] = date.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  const { data: monthData, isLoading: plansLoading } = usePaymentsMonthQuery({ driverId, year, month });
  const create = usePaymentCreate();
  const plans = monthData?.plans || [];
  const plan = plans.find((p) => p.dateKey === date) || null;

  // Sana bo'yicha holatni aniqlaymiz.
  let blockMsg = "";
  if (driverId && date && !plansLoading) {
    if (!plan) blockMsg = "Bu kun haydovchining ish davriga to'g'ri kelmaydi";
    else if (plan.isRestDay) blockMsg = "Dam olish kuni - to'lov majburiyati yo'q";
    else if (plan.priceMissing) blockMsg = "Bu kun uchun narx belgilanmagan";
    else if (plan.debt <= 0) blockMsg = "Bu kun uchun to'lov to'liq amalga oshirilgan";
  }
  const payable = !!plan && !plan.isRestDay && !plan.priceMissing && plan.debt > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!payable || !value) return;
    create.mutate(
      { dailyPlanId: plan._id, amount: value, note },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Haydovchi"
        searchable
        placeholder="Haydovchini tanlang"
        searchPlaceholder="Ism yoki telefon..."
        value={driverId}
        onChange={setDriverId}
        options={drivers.map((d) => ({ value: d._id, label: driverLabel(d) }))}
      />

      <InputField
        label="Sana"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={todayStr()}
      />

      {payable && (
        <div className="rounded-lg border p-2 text-xs text-muted-foreground flex justify-between">
          <span>Kunlik reja: {formatMoney(plan.planAmount)}</span>
          <span>Qoldiq qarz: {formatMoney(plan.debt)}</span>
        </div>
      )}
      {driverId && blockMsg && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">{blockMsg}</p>
      )}

      <InputField
        label="To'lov summasi"
        type="price"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0"
        disabled={!payable || create.isPending}
      />
      <InputField
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Izoh (ixtiyoriy)"
        disabled={!payable || create.isPending}
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={create.isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={!payable || !Number(amount) || create.isPending}>
          {create.isPending ? "Saqlanmoqda..." : "To'lov qo'shish"}
        </Button>
      </div>
    </form>
  );
};

export default AddPaymentModal;
