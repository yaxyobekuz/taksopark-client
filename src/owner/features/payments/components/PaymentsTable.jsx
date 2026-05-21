import { Pencil, Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";

const PaymentsTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">To'lov yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-right p-3">Kutilgan</th>
            <th className="text-right p-3">To'langan</th>
            <th className="text-right p-3">Qolgan</th>
            <th className="text-left p-3">Izoh</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const deficit = Math.max(0, p.expectedPlan - p.amount);
            return (
              <tr key={p._id} className="border-t">
                <td className="p-3">{formatDateUZ(p.date)}</td>
                <td className="p-3">
                  {p.driver ? `${p.driver.firstName} ${p.driver.lastName}` : "-"}
                </td>
                <td className="p-3 text-right text-muted-foreground">{formatMoney(p.expectedPlan)}</td>
                <td className="p-3 text-right font-medium">{formatMoney(p.amount)}</td>
                <td className={`p-3 text-right ${deficit > 0 ? "text-red-600" : ""}`}>
                  {deficit > 0 ? formatMoney(deficit) : "-"}
                </td>
                <td className="p-3">{p.note || "-"}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {has(PERMISSIONS.PAYMENTS_UPDATE) && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.PAYMENT_EDIT, { payment: p })}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {has(PERMISSIONS.PAYMENTS_DELETE) && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.PAYMENT_DELETE, { payment: p })}
                        className="text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;
