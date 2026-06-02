import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";

const OylikSummaryCard = ({ oylik }) => {
  if (!oylik) return null;
  const planDeficit = Math.max(0, oylik.expectedPlanTotal - oylik.paidTotal);
  const overpay = Math.max(0, oylik.paidTotal - oylik.expectedPlanTotal);
  const deductions = planDeficit + oylik.finesTotal + oylik.damagesTotal;
  const earnedPayout = Math.max(0, oylik.salary - deductions + overpay);
  const remainingPayout = Math.max(0, earnedPayout - (oylik.paidOut || 0));
  // Server-computed virtuals from Oylik schema
  const isLate = oylik.isLate || false;
  const lateDays = oylik.lateDays || 0;

  return (
    <div className="rounded-lg border p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Davr:{" "}
          <span className="font-medium text-foreground">
            {formatDateUZ(oylik.startDate)} - {formatDateUZ(oylik.endDate)}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-muted-foreground">
            Muddat: {formatDateUZ(oylik.dueDate)}
          </span>
          {isLate && (
            <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 font-semibold">
              Kechikkan ({lateDays} kun)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Oylik</p>
          <p className="font-semibold">{formatMoney(oylik.salary)}</p>
        </div>
        {oylik.expectedPlanTotal > 0 && (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Yig'ilgan</p>
              <p className="font-semibold">{formatMoney(oylik.paidTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Oylik reja</p>
              <p>{formatMoney(oylik.expectedPlanTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plan qoldig'i</p>
              <p>{formatMoney(planDeficit)}</p>
            </div>
          </>
        )}
        {overpay > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Ortiqcha to'lov (bonus)</p>
            <p className="font-semibold text-emerald-600">+{formatMoney(overpay)}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground">Jarima</p>
          <p>{formatMoney(oylik.finesTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Zarar</p>
          <p>{formatMoney(oylik.damagesTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hisoblangan haq</p>
          <p className="font-semibold">{formatMoney(earnedPayout)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Berilgan</p>
          <p className="font-semibold">{formatMoney(oylik.paidOut || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Qolgan to'lov</p>
          <p className={remainingPayout > 0 ? "font-semibold text-primary" : ""}>
            {formatMoney(remainingPayout)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OylikSummaryCard;
