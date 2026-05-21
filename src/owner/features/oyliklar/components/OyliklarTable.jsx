import { Link } from "react-router-dom";
import { CheckSquare, Wallet, FileText } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";

const computeRow = (o) => {
  const planDeficit = Math.max(0, o.expectedPlanTotal - o.paidTotal);
  const deductions = planDeficit + o.finesTotal + o.damagesTotal;
  const earnedPayout = Math.max(0, o.salary + (o.carryIn || 0) - deductions);
  const remainingPayout = Math.max(0, earnedPayout - (o.paidOut || 0));
  return { planDeficit, earnedPayout, remainingPayout, isLate: o.isLate || false };
};

const OyliklarTable = ({ items = [], variant = "default" }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Oylik yo'q</p>;

  const isStatement = variant === "statement";

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">#</th>
            {!isStatement && <th className="text-left p-3">Haydovchi</th>}
            <th className="text-left p-3">Davr</th>
            <th className="text-left p-3">Muddat</th>
            <th className="text-right p-3">Reja / Yig'ilgan</th>
            <th className="text-right p-3">Jarima / Zarar</th>
            <th className="text-right p-3">Hisoblangan</th>
            <th className="text-right p-3">Berilgan / Qolgan</th>
            {isStatement && <th className="text-right p-3">Jami qoldiq</th>}
            <th className="text-left p-3">Holat</th>
            {!isStatement && <th className="text-right p-3">Amallar</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((o) => {
            const { planDeficit, earnedPayout, remainingPayout, isLate } = computeRow(o);
            return (
              <tr key={o._id} className="border-t">
                <td className="p-3 font-medium">{o.oylikNumber}</td>
                {!isStatement && (
                  <td className="p-3">
                    {o.driver ? `${o.driver.firstName} ${o.driver.lastName}` : "-"}
                  </td>
                )}
                <td className="p-3 whitespace-nowrap">
                  {new Date(o.startDate).toLocaleDateString("uz-UZ")} -{" "}
                  {new Date(o.endDate).toLocaleDateString("uz-UZ")}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {new Date(o.dueDate).toLocaleDateString("uz-UZ")}
                  {isLate && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700">
                      kechikkan
                    </span>
                  )}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  {o.expectedPlanTotal > 0 ? (
                    <>
                      <div>{formatMoney(o.expectedPlanTotal)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatMoney(o.paidTotal)} ({formatMoney(planDeficit)} qoldi)
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <div>{formatMoney(o.finesTotal)}</div>
                  <div className="text-xs text-muted-foreground">{formatMoney(o.damagesTotal)}</div>
                </td>
                <td className="p-3 text-right font-medium whitespace-nowrap">
                  {formatMoney(earnedPayout)}
                  {o.carryIn !== 0 && (
                    <div
                      className={`text-xs ${
                        o.carryIn < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {o.carryIn > 0 ? "+" : ""}
                      {formatMoney(o.carryIn || 0)}
                    </div>
                  )}
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <div>{formatMoney(o.paidOut || 0)}</div>
                  <div
                    className={`text-xs ${remainingPayout > 0 ? "text-primary font-medium" : "text-muted-foreground"}`}
                  >
                    {formatMoney(remainingPayout)}
                  </div>
                </td>
                {isStatement && (
                  <td className="p-3 text-right whitespace-nowrap">
                    <span
                      className={
                        (o.runningBalance || 0) < 0
                          ? "text-red-600 font-medium"
                          : (o.runningBalance || 0) > 0
                            ? "text-green-700 font-medium"
                            : ""
                      }
                    >
                      {formatMoney(o.runningBalance || 0)}
                    </span>
                  </td>
                )}
                <td className="p-3">
                  <span
                    className={
                      o.status === "active"
                        ? "text-amber-600"
                        : "text-green-600"
                    }
                  >
                    {o.status === "active" ? "Faol" : "Yopilgan"}
                  </span>
                </td>
                {!isStatement && (
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {o.driver && (
                        <Link
                          to={`/owner/drivers/${o.driver._id || o.driver}/oyliklar`}
                          className="text-muted-foreground hover:text-foreground"
                          title="Hisob-kitob"
                        >
                          <FileText size={16} />
                        </Link>
                      )}
                      {o.status === "active" && has(PERMISSIONS.OYLIKLAR_PAYOUT) && remainingPayout > 0 && (
                        <button
                          type="button"
                          onClick={() => openModal(MODAL.OYLIK_PAYOUT, { oylik: o })}
                          className="text-muted-foreground hover:text-foreground"
                          title="To'lov berish"
                        >
                          <Wallet size={16} />
                        </button>
                      )}
                      {o.status === "active" && has(PERMISSIONS.OYLIKLAR_CLOSE) && (
                        <button
                          type="button"
                          onClick={() => openModal(MODAL.OYLIK_CLOSE, { oylik: o })}
                          className="text-muted-foreground hover:text-foreground"
                          title="Yopish"
                        >
                          <CheckSquare size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OyliklarTable;
