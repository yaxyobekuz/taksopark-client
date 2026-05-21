import { formatMoney } from "@/shared/utils/formatMoney";

const OylikBalancePanel = ({ oylik }) => {
  if (!oylik) return <p className="text-sm text-muted-foreground">Joriy oylik yo'q</p>;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Davr: {new Date(oylik.startDate).toLocaleDateString("uz-UZ")} -{" "}
          {new Date(oylik.endDate).toLocaleDateString("uz-UZ")}
        </span>
        <span>
          Muddat: {new Date(oylik.dueDate).toLocaleDateString("uz-UZ")}
          {oylik.isLate && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-semibold">
              {oylik.lateDays} kun kechikkan
            </span>
          )}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Oylik</p>
          <p className="font-semibold">{formatMoney(oylik.salary)}</p>
        </div>
        {oylik.expectedPlanTotal > 0 && (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Yig'ilgan to'lov</p>
              <p className="font-semibold">{formatMoney(oylik.paidTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Oylik reja</p>
              <p>{formatMoney(oylik.expectedPlanTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plan qoldig'i</p>
              <p>{formatMoney(oylik.planDeficit)}</p>
            </div>
          </>
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
          <p className="font-semibold text-primary">{formatMoney(oylik.earnedPayout)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Berilgan</p>
          <p>{formatMoney(oylik.paidOut || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Qolgan to'lov</p>
          <p
            className={
              (oylik.remainingPayout || 0) > 0 ? "font-semibold text-primary" : "text-muted-foreground"
            }
          >
            {formatMoney(oylik.remainingPayout || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OylikBalancePanel;
