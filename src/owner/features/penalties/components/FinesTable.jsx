import { Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
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

const FinesTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Jarima yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Mashina</th>
            <th className="text-right p-3">Summa</th>
            <th className="text-left p-3">Hujjat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f._id} className="border-t align-top">
              <td className="p-3">{formatDateUZ(f.issueDate)}</td>
              <td className="p-3">{f.driver ? `${f.driver.firstName} ${f.driver.lastName}` : "-"}</td>
              <td className="p-3"><CarCell car={f.car} /></td>
              <td className="p-3 text-right font-medium">{formatMoney(f.amount)}</td>
              <td className="p-3">
                <AttachmentPreview attachments={f.attachments} />
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {has(PERMISSIONS.FINES_DELETE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.FINE_DELETE, { fine: f })}
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

export default FinesTable;
