import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useOylikPayoutCreate } from "../../hooks/useOylikPayoutMutations";
import PayoutsList from "../PayoutsList";

const computeRemaining = (oylik) => {
  if (!oylik) return 0;
  const planDeficit = Math.max(0, oylik.expectedPlanTotal - oylik.paidTotal);
  const overpay = Math.max(0, oylik.paidTotal - oylik.expectedPlanTotal);
  const deductions = planDeficit + oylik.finesTotal + oylik.damagesTotal;
  const earned = Math.max(0, oylik.salary - deductions + overpay);
  return Math.max(0, earned - (oylik.paidOut || 0));
};

const OylikPayoutModal = ({ close, oylik }) => {
  const remaining = computeRemaining(oylik);
  const { amount, paidAt, note, setField, state } = useObjectState({
    amount: "",
    paidAt: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const { mutate, isPending } = useOylikPayoutCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oylik?._id) return;
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) return;
    mutate(
      { id: oylik._id, body: { ...state, amount: amountNum } },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded bg-muted/40 p-3 text-sm space-y-1">
        <p>
          Haydovchi:{" "}
          <span className="font-semibold">
            {oylik?.driver?.firstName} {oylik?.driver?.lastName}
          </span>
        </p>
        <p>
          Qolgan to'lov:{" "}
          <span className="font-semibold text-primary">{formatMoney(remaining)}</span>
        </p>
      </div>

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

      {oylik?.payouts?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Avval berilgan to'lovlar</p>
          <PayoutsList oylikId={oylik._id} payouts={oylik.payouts} />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending || remaining <= 0}>
          {isPending ? "Saqlanmoqda..." : "To'lov berish"}
        </Button>
      </div>
    </form>
  );
};

export default OylikPayoutModal;
