import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useDriverAdjustDeposit } from "../../hooks/useDriverMutations";

const DIRECTION_OPTIONS = [
  { value: "topup", label: "Qo'shish" },
  { value: "withdraw", label: "Qaytarib olish" },
];

const DriverDepositModal = ({ close, driver }) => {
  const { mutate, isPending } = useDriverAdjustDeposit();
  const { direction, amount, note, setField } = useObjectState({
    direction: "topup",
    amount: "",
    note: "",
  });

  const remaining = driver?.depositRemaining ?? 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver?._id || amount === "" || Number(amount) <= 0) return;
    const delta = direction === "withdraw" ? -Number(amount) : Number(amount);
    mutate({ id: driver._id, delta, note }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Joriy depozit: <span className="font-semibold">{formatMoney(remaining)}</span>
      </p>
      <SelectField
        label="Amal"
        value={direction}
        onChange={(v) => setField("direction", v)}
        options={DIRECTION_OPTIONS}
        disabled={isPending}
      />
      <InputField
        label="Summa (UZS)"
        type="price"
        value={amount}
        onChange={(e) => setField("amount", e.target.value)}
        placeholder="500 000"
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

export default DriverDepositModal;
