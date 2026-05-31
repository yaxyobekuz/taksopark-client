import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { useDriversQuery } from "@/owner/features/drivers";
import { usePaymentCreate } from "../../hooks/usePaymentMutations";

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
  const { mutate, isPending } = usePaymentCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverId || !date || amount === "") return;
    mutate({ ...state, amount: Number(amount) }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Haydovchi"
        searchable
        placeholder="Tanlang"
        searchPlaceholder="Ism yoki mashina raqami..."
        value={driverId}
        onChange={(v) => setField("driverId", v)}
        options={driverOptions}
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
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default PaymentCreateModal;
