import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import OylikSummaryCard from "../OylikSummaryCard";
import { useOylikCloseMutation } from "../../hooks/useOylikCloseMutation";

const computeRemaining = (oylik) => {
  if (!oylik) return 0;
  const planDeficit = Math.max(0, oylik.expectedPlanTotal - oylik.paidTotal);
  const deductions = planDeficit + oylik.finesTotal + oylik.damagesTotal;
  const earned = Math.max(0, oylik.salary + (oylik.carryIn || 0) - deductions);
  return Math.max(0, earned - (oylik.paidOut || 0));
};

const OylikCloseModal = ({ close, oylik }) => {
  const { mutate, isPending } = useOylikCloseMutation();
  const remaining = computeRemaining(oylik);

  const handleClick = () => {
    if (!oylik?._id) return;
    mutate(oylik._id, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">
          {oylik?.driver?.firstName} {oylik?.driver?.lastName}
        </span>{" "}
        haydovchining{" "}
        <span className="font-semibold">{oylik?.oylikNumber}</span>-oyligini yopmoqchimisiz?
      </p>
      <OylikSummaryCard oylik={oylik} />
      {remaining > 0 && (
        <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
          Diqqat! Bu oylikda {formatMoney(remaining)} qolgan to'lov bor. Yopilsa, bu summa
          keyingi oyga "kredit" sifatida o'tadi.
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button className="flex-1" onClick={handleClick} disabled={isPending}>
          {isPending ? "Yopilmoqda..." : "Oylikni yopish"}
        </Button>
      </div>
    </div>
  );
};

export default OylikCloseModal;
