import { CheckSquare } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";

const CyclesTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Tsikl yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Davr</th>
            <th className="text-right p-3">Reja</th>
            <th className="text-right p-3">Yig'ilgan</th>
            <th className="text-right p-3">Jarima</th>
            <th className="text-right p-3">Zarar</th>
            <th className="text-right p-3">Oylik</th>
            <th className="text-left p-3">Holat</th>
            <th className="text-right p-3">Amal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-3">{c.cycleNumber}</td>
              <td className="p-3">
                {c.driver ? `${c.driver.firstName} ${c.driver.lastName}` : "-"}
              </td>
              <td className="p-3">
                {new Date(c.startDate).toLocaleDateString("uz-UZ")} -{" "}
                {new Date(c.endDate).toLocaleDateString("uz-UZ")}
              </td>
              <td className="p-3 text-right">{formatMoney(c.expectedPlanTotal)}</td>
              <td className="p-3 text-right">{formatMoney(c.paidTotal)}</td>
              <td className="p-3 text-right">{formatMoney(c.finesTotal)}</td>
              <td className="p-3 text-right">{formatMoney(c.damagesTotal)}</td>
              <td className="p-3 text-right font-medium">
                {c.status === "settled" ? formatMoney(c.finalPayout) : formatMoney(c.salary)}
              </td>
              <td className="p-3">
                <span className={c.status === "open" ? "text-amber-600" : "text-green-600"}>
                  {c.status === "open" ? "Ochiq" : "Yakunlangan"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {c.status === "open" && has(PERMISSIONS.CYCLES_SETTLE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.CYCLE_SETTLE, { cycle: c })}
                      className="text-muted-foreground hover:text-foreground"
                      title="Yakunlash"
                    >
                      <CheckSquare size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CyclesTable;
