import { Pencil, Trash2 } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { cn } from "@/shared/utils/cn";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { periodState } from "../utils/carPrice.utils";

const STATE_BADGE = {
  active: { label: "Faol", className: "bg-green-50 text-green-700" },
  future: { label: "Kelajak", className: "bg-amber-50 text-amber-700" },
  past: { label: "Yakunlangan", className: "bg-gray-100 text-gray-600" },
};

const CarPricesTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.CAR_PRICES_MANAGE);

  if (!items.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground">
            <th className="text-right p-3 font-medium">Depozit (kunlik)</th>
            <th className="text-right p-3 font-medium">Keshbek (kunlik)</th>
            <th className="text-right p-3 font-medium">Oylik keshbek</th>
            <th className="text-left p-3 font-medium">Boshlanish</th>
            <th className="text-left p-3 font-medium">Tugash</th>
            <th className="text-left p-3 font-medium">Holat</th>
            {canManage && <th className="text-right p-3 font-medium">Amallar</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const state = STATE_BADGE[periodState(p)] || STATE_BADGE.past;
            return (
              <tr key={p._id} className="border-t align-middle">
                <td className="p-3 text-right font-medium">
                  {formatMoney(p.dailyRateDeposit)}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatMoney(p.dailyRateCashback)}
                </td>
                <td className="p-3 text-right">{formatMoney(p.monthlyCashback)}</td>
                <td className="p-3">{formatDateUZ(p.startDate)}</td>
                <td className="p-3">
                  {p.endDate ? (
                    formatDateUZ(p.endDate)
                  ) : (
                    <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      Ochiq
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      "inline-flex text-xs font-medium px-2 py-0.5 rounded",
                      state.className,
                    )}
                  >
                    {state.label}
                  </span>
                </td>
                {canManage && (
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.CAR_PRICE_FORM, { period: p, carId: p.car })}
                        className="text-muted-foreground hover:text-primary"
                        title="Tahrirlash"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.CAR_PRICE_DELETE, { period: p })}
                        className="text-muted-foreground hover:text-red-600"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default CarPricesTable;
