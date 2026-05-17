import { Link } from "react-router-dom";
import { Pencil, Ban, Trash2, ShieldCheck } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { TARIFF_LABELS, TARIFFS, TARIFF_CONFIG } from "@/shared/constants/tariffs";
import { formatMoney } from "@/shared/utils/formatMoney";
import WarningBadge from "./WarningBadge";

const STATUS_LABEL = {
  active: { text: "Faol", className: "text-green-600" },
  blocked: { text: "Bloklangan", className: "text-red-600" },
  archived: { text: "Arxivlangan", className: "text-muted-foreground" },
};

const DriversTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const threshold = TARIFF_CONFIG[TARIFFS.DEPOSIT].depositWarnThreshold;

  if (!items.length) {
    return <p className="text-sm text-muted-foreground p-4">Haydovchi yo'q</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">F.I.SH</th>
            <th className="text-left p-3">Telefon</th>
            <th className="text-left p-3">Tarif</th>
            <th className="text-left p-3">Mashina</th>
            <th className="text-left p-3">Depozit</th>
            <th className="text-left p-3">Holat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => {
            const isDepositLow =
              d.tariff === TARIFFS.DEPOSIT &&
              d.depositRemaining > 0 &&
              d.depositRemaining < threshold;
            const isDepositEmpty = d.tariff === TARIFFS.DEPOSIT && d.depositRemaining <= 0;
            const status = STATUS_LABEL[d.status] || STATUS_LABEL.archived;
            return (
              <tr key={d._id} className="border-t">
                <td className="p-3">
                  <Link to={`/owner/drivers/${d._id}`} className="font-medium text-primary hover:underline">
                    {d.firstName} {d.lastName}
                  </Link>
                </td>
                <td className="p-3">{d.phone}</td>
                <td className="p-3">{TARIFF_LABELS[d.tariff] || d.tariff}</td>
                <td className="p-3">{d.car?.plateNumber || "-"}</td>
                <td className="p-3">
                  {d.tariff === TARIFFS.DEPOSIT ? (
                    <div className="flex items-center gap-2">
                      <span>{formatMoney(d.depositRemaining)}</span>
                      {isDepositLow && <WarningBadge code="deposit_low" />}
                      {isDepositEmpty && <WarningBadge code="deposit_empty" />}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-3">
                  <span className={status.className}>{status.text}</span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    {has(PERMISSIONS.DRIVERS_UPDATE) && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.DRIVER_EDIT, { driver: d })}
                        className="text-muted-foreground hover:text-foreground"
                        title="Tahrirlash"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {has(PERMISSIONS.DRIVERS_BLOCK) && d.status === "active" && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.DRIVER_BLOCK, { driver: d })}
                        className="text-muted-foreground hover:text-red-600"
                        title="Bloklash"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                    {has(PERMISSIONS.DRIVERS_BLOCK) && d.status === "blocked" && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.DRIVER_UNBLOCK, { driver: d })}
                        className="text-muted-foreground hover:text-green-600"
                        title="Blokdan chiqarish"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                    {has(PERMISSIONS.DRIVERS_DELETE) && (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.DRIVER_DELETE, { driver: d })}
                        className="text-muted-foreground hover:text-red-600"
                        title="Arxivlash"
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

export default DriversTable;
