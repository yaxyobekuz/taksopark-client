import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import CycleSummaryCard from "../CycleSummaryCard";
import { useCycleSettleMutation } from "../../hooks/useCycleSettleMutation";

const CycleSettleModal = ({ close, cycle }) => {
  const { mutate, isPending } = useCycleSettleMutation();
  const planDeficit = cycle ? Math.max(0, cycle.expectedPlanTotal - cycle.paidTotal) : 0;
  const deductions = cycle ? planDeficit + cycle.finesTotal + cycle.damagesTotal : 0;
  const payout = cycle ? Math.max(0, cycle.salary - deductions) : 0;

  const handleClick = () => {
    if (!cycle?._id) return;
    mutate(cycle._id, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">
          {cycle?.driver?.firstName} {cycle?.driver?.lastName}
        </span>{" "}
        haydovchining <span className="font-semibold">{cycle?.cycleNumber}</span>-tsiklini yakunlamoqchimisiz?
      </p>
      <CycleSummaryCard cycle={cycle} />
      <p className="text-sm">
        Beriladigan oylik: <span className="font-semibold text-primary">{formatMoney(payout)}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button className="flex-1" onClick={handleClick} disabled={isPending}>
          {isPending ? "Yakunlanmoqda..." : "Yakunlash"}
        </Button>
      </div>
    </div>
  );
};

export default CycleSettleModal;
