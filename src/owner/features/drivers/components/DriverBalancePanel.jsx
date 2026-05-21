import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";
import {
  TARIFFS,
  TARIFF_LABELS,
  TARIFF_TEXT_CLASS,
} from "@/shared/constants/tariffs";
import { OylikBalancePanel } from "@/owner/features/oyliklar";
import WarningBadge from "./WarningBadge";

const DriverBalancePanel = ({ balance, isLoading }) => {
  if (isLoading)
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  if (!balance) return null;

  const { tariff, phase, deposit, oylik, driver, warnings = [] } = balance;

  return (
    <Card className="space-y-3" title="Balans va Tarif">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Tarif</p>
          <p className={`font-semibold ${TARIFF_TEXT_CLASS[tariff] || ""}`}>
            {TARIFF_LABELS[tariff] || tariff}
          </p>
          {driver?.trialEndedAt && (
            <p className="text-xs text-muted-foreground">
              Sinov tugagan:{" "}
              {new Date(driver.trialEndedAt).toLocaleDateString("uz-UZ")}
            </p>
          )}
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

      {tariff === TARIFFS.NO_DEPOSIT && <OylikBalancePanel oylik={oylik} />}

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
