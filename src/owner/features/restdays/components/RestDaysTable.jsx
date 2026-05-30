import { Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatDateUZ } from "@/shared/utils/date.utils";

const RestDaysTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length)
    return <p className="text-sm text-muted-foreground p-4">Dam olish kuni yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Izoh</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="p-3">{formatDateUZ(r.date)}</td>
              <td className="p-3">
                {r.driver ? `${r.driver.firstName} ${r.driver.lastName}` : "-"}
              </td>
              <td className="p-3">{r.note || "-"}</td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {has(PERMISSIONS.REST_DAYS_MANAGE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.REST_DAY_DELETE, { restDay: r })}
                      className="text-muted-foreground hover:text-red-600"
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

export default RestDaysTable;
