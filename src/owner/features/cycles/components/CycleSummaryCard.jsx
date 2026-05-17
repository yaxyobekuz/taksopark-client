import { formatMoney } from "@/shared/utils/formatMoney";

const CycleSummaryCard = ({ cycle }) => {
  if (!cycle) return null;
  const planDeficit = Math.max(0, cycle.expectedPlanTotal - cycle.paidTotal);
  const deductions = planDeficit + cycle.finesTotal + cycle.damagesTotal;
  const payout = Math.max(0, cycle.salary - deductions);
  const debt = Math.max(0, deductions - cycle.salary);

  return (
    <div className="rounded-lg border p-4 bg-white space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Oylik</p>
          <p className="font-semibold">{formatMoney(cycle.salary)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Yig'ilgan</p>
          <p className="font-semibold">{formatMoney(cycle.paidTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Kutilgan reja</p>
          <p>{formatMoney(cycle.expectedPlanTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Plan Qolgan</p>
          <p>{formatMoney(planDeficit)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Jarima</p>
          <p>{formatMoney(cycle.finesTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Zarar</p>
          <p>{formatMoney(cycle.damagesTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Beriladigan oylik</p>
          <p className="font-semibold text-primary">{formatMoney(payout)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Qarz</p>
          <p className={debt > 0 ? "text-red-600 font-semibold" : ""}>{formatMoney(debt)}</p>
        </div>
      </div>
    </div>
  );
};

export default CycleSummaryCard;
