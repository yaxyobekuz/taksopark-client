import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_BADGE_CLASS } from "@/shared/constants/drivers";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";

const stop = (e) => e.stopPropagation();

const DriversTable = ({ items = [] }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();

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
            <th className="text-left p-3">Mashina</th>
            <th className="text-left p-3">Holat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr
              key={d._id}
              onClick={() => navigate(`/owner/drivers/${d._id}`)}
              className="border-t cursor-pointer hover:bg-muted/50"
            >
              <td className="p-3 font-medium">
                <div className="flex items-center gap-2">
                  {buildFileUrl(d.photoUrl) ? (
                    <img
                      src={buildFileUrl(d.photoUrl)}
                      alt=""
                      className="size-8 rounded-full object-cover border shrink-0"
                    />
                  ) : (
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
                      {(d.firstName?.[0] || "?").toUpperCase()}
                    </div>
                  )}
                  <span>{d.firstName} {d.lastName}</span>
                </div>
              </td>
              <td className="p-3">{d.phone}</td>
              <td className="p-3">{d.car?.plateNumber ? <PlateNumber value={d.car.plateNumber} size="sm" /> : "-"}</td>
              <td className="p-3">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    DRIVER_STATUS_BADGE_CLASS[d.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {DRIVER_STATUS_LABELS[d.status] || d.status}
                </span>
              </td>
              <td className="p-3" onClick={stop}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversTable;
