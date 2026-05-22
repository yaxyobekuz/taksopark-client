import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { usePaymentUpdate } from "../../hooks/usePaymentMutations";

const PaymentEditModal = ({ close, payment }) => {
  const { amount, note, setField, setFields, state } = useObjectState({
    amount: payment?.amount ?? "",
    note: payment?.note || "",
  });
  useEffect(() => {
    if (!payment) return;
    setFields({ amount: payment.amount, note: payment.note || "" });
  }, [payment, setFields]);
  const { mutate, isPending } = usePaymentUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payment?._id) return;
    mutate({ id: payment._id, ...state, amount: Number(state.amount) }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

export default PaymentEditModal;
