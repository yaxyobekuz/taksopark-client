import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useOylikPayoutUpdate } from "../../hooks/useOylikPayoutMutations";

const OylikPayoutEditModal = ({ close, oylikId, payout }) => {
  const { amount, paidAt, note, setField, state } = useObjectState({
    amount: payout?.amount ?? "",
    paidAt: payout?.paidAt ? new Date(payout.paidAt).toISOString().slice(0, 10) : "",
    note: payout?.note ?? "",
  });
  const { mutate, isPending } = useOylikPayoutUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oylikId || !payout?._id) return;
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) return;
    mutate(
      { id: oylikId, payoutId: payout._id, body: { ...state, amount: amountNum } },
      { onSuccess: () => close() },
    );
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
        label="Berilgan sana"
        type="date"
        value={paidAt}
        onChange={(e) => setField("paidAt", e.target.value)}
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

export default OylikPayoutEditModal;
