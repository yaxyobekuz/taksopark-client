import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";
import {
  TARIFFS,
  TARIFF_LABELS,
  TARIFF_TEXT_CLASS,
} from "@/shared/constants/tariffs";
import WarningBadge from "./WarningBadge";

const DriverBalancePanel = ({ balance, isLoading }) => {
  if (isLoading)
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  if (!balance) return null;

  const { tariff, phase, deposit, cycle, warnings = [] } = balance;

  return (
    <Card className="space-y-3" title="Balans va Tarif">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tarif</p>
          <p className={`font-semibold ${TARIFF_TEXT_CLASS[tariff] || ""}`}>
            {TARIFF_LABELS[tariff] || tariff}
          </p>
        </div>
        {phase?.phase && (
          <span className="text-xs px-2 py-1 rounded bg-muted">
            {phase.phase === "deposit" && "Depozit"}
            {phase.phase === "trial" &&
              `Sinov (${phase.trialDaysLeft} kun qoldi)`}
            {phase.phase === "salary" && "Oylik"}
          </span>
        )}
      </div>

      {tariff === TARIFFS.DEPOSIT && deposit && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Boshlang'ich depozit
            </p>
            <p className="font-semibold">{formatMoney(deposit.initial)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Qolgan depozit</p>
            <p className="font-semibold text-primary">
              {formatMoney(deposit.remaining)}
            </p>
          </div>
        </div>
      )}

      {tariff === TARIFFS.NO_DEPOSIT && cycle && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Oylik</p>
              <p className="font-semibold">{formatMoney(cycle.salary)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yig'ilgan to'lov</p>
              <p className="font-semibold">{formatMoney(cycle.paidTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kutilgan reja</p>
              <p>{formatMoney(cycle.expectedPlanTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Plan Qolgan</p>
              <p>{formatMoney(cycle.planDeficit)}</p>
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
              <p className="font-semibold text-primary">
                {formatMoney(cycle.payout)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Qarz</p>
              <p className={cycle.debt > 0 ? "text-red-600 font-semibold" : ""}>
                {formatMoney(cycle.debt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {warnings.map((w) => (
            <WarningBadge key={w.code} code={w.code} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default DriverBalancePanel;
