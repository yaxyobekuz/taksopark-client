import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { TARIFFS, TARIFF_CONFIG } from "@/shared/constants/tariffs";
import { useDriversQuery } from "@/owner/features/drivers";
import { usePaymentCreate } from "../../hooks/usePaymentMutations";

// Tanlangan sana haydovchining oylik fazasiga to'g'ri keladimi?
const isSalaryPhaseOn = (driver, dateStr) => {
  if (!driver || driver.tariff !== TARIFFS.NO_DEPOSIT) return false;
  const ref = new Date(dateStr);
  ref.setHours(0, 0, 0, 0);
  if (driver.trialEndedAt) {
    const te = new Date(driver.trialEndedAt);
    te.setHours(0, 0, 0, 0);
    if (ref >= te) return true;
  }
  const trialDays = TARIFF_CONFIG[TARIFFS.NO_DEPOSIT].trialDays;
  const autoEnd = new Date(driver.startDate);
  autoEnd.setHours(0, 0, 0, 0);
  autoEnd.setDate(autoEnd.getDate() + trialDays);
  return ref >= autoEnd;
};

const PaymentCreateModal = ({ close, presetDriverId }) => {
  const { driverId, date, amount, note, setField, state } = useObjectState({
    driverId: presetDriverId || "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    note: "",
  });
  const { data: driversData } = useDriversQuery({ limit: 500, status: "active" });
  const drivers = driversData?.data || [];
  const driverOptions = drivers.map((d) => ({
    value: d._id,
    label: `${d.firstName} ${d.lastName} (${d.car?.plateNumber || "mashina yo'q"})`,
  }));
  const selectedDriver = drivers.find((d) => d._id === driverId);
  const blocked = isSalaryPhaseOn(selectedDriver, date);
  const { mutate, isPending } = usePaymentCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverId || !date || amount === "" || blocked) return;
    mutate({ ...state, amount: Number(amount) }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Haydovchi"
        value={driverId}
        onChange={(v) => setField("driverId", v)}
        options={[{ value: "", label: "Tanlang" }, ...driverOptions]}
        required
        disabled={isPending || !!presetDriverId}
      />
      <InputField
        label="Sana"
        type="date"
        value={date}
        onChange={(e) => setField("date", e.target.value)}
        required
        disabled={isPending}
      />
      {blocked && (
        <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          Bu sana haydovchining oylik fazasiga to'g'ri keladi. Oylik fazasida kunlik
          to'lov qabul qilinmaydi. Faqat sinov davridagi sanani tanlang.
        </div>
      )}
      <InputField
        label="Summa (so'm)"
        type="price"
        value={amount}
        onChange={(e) => setField("amount", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={note}
        onChange={(e) => setField("note", e.target.value)}
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending || blocked}>
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default PaymentCreateModal;
