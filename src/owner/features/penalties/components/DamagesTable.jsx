import { Trash2, Wallet } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { PAYMENT_STATUS } from "@/shared/constants/payments";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import AttachmentPreview from "./AttachmentPreview";

const CarCell = ({ car }) => {
  if (!car) return "-";
  const name = car.model || car.plateNumber || "-";
  const tooltip = (
    <div className="space-y-0.5 text-xs">
      {car.model && <div><span className="text-muted-foreground">Nomi:</span> {car.model}</div>}
      {car.plateNumber && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Raqami:</span>
          <PlateNumber value={car.plateNumber} size="sm" />
        </div>
      )}
      {car.notes && <div><span className="text-muted-foreground">Izoh:</span> {car.notes}</div>}
    </div>
  );
  return (
    <Tooltip content={tooltip}>
      <span className="cursor-help underline decoration-dotted underline-offset-4">{name}</span>
    </Tooltip>
  );
};

const DamagesTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Zarar yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Mashina</th>
            <th className="text-right p-3">Summa</th>
            <th className="text-right p-3">To'langan</th>
            <th className="text-right p-3">Qolgan</th>
            <th className="text-left p-3">Hujjat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d._id} className="border-t align-top">
              <td className="p-3">{formatDateUZ(d.incidentDate)}</td>
              <td className="p-3">{d.driver ? `${d.driver.firstName} ${d.driver.lastName}` : "-"}</td>
              <td className="p-3"><CarCell car={d.car} /></td>
              <td className="p-3 text-right font-medium">{formatMoney(d.amount)}</td>
              {(() => {
                const remaining = Math.max(0, d.amount - (d.paidAmount || 0));
                return (
                  <>
                    <td className="p-3 text-right text-green-700">{formatMoney(d.paidAmount || 0)}</td>
                    <td className={`p-3 text-right font-medium ${remaining > 0 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {formatMoney(remaining)}
                    </td>
                  </>
                );
              })()}
              <td className="p-3">
                <AttachmentPreview attachments={d.attachments} />
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {has(PERMISSIONS.DAMAGES_PAY) && d.paymentStatus !== PAYMENT_STATUS.PAID && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.DAMAGE_PAY, { damage: d })}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      title="To'lash"
                    >
                      <Wallet size={14} /> To'lash
                    </button>
                  )}
                  {has(PERMISSIONS.DAMAGES_PAY) && d.paymentStatus === PAYMENT_STATUS.PAID && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.DAMAGE_PAY, { damage: d })}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      title="To'lovlar"
                    >
                      <Wallet size={14} /> Ko'rish
                    </button>
                  )}
                  {has(PERMISSIONS.DAMAGES_DELETE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.DAMAGE_DELETE, { damage: d })}
                      className="text-muted-foreground hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 size={16} />
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

export default DamagesTable;
