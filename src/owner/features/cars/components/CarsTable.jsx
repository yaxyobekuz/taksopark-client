import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";

const stop = (e) => e.stopPropagation();

const CarsTable = ({ items = [] }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) {
    return <p className="text-sm text-muted-foreground p-4">Mashina yo'q</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Davlat raqami</th>
            <th className="text-left p-3">Model</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((car) => (
            <tr
              key={car._id}
              onClick={() => navigate(`/owner/cars/${car._id}`)}
              className="border-t cursor-pointer hover:bg-muted/50"
            >
              <td className="p-3">
                <PlateNumber value={car.plateNumber} size="sm" />
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {buildFileUrl(car.photoUrl) ? (
                    <img
                      src={buildFileUrl(car.photoUrl)}
                      alt=""
                      className="size-8 rounded object-cover border shrink-0"
                    />
                  ) : null}
                  <span>{car.model}</span>
                </div>
              </td>
              <td className="p-3">
                {car.currentDriver
                  ? `${car.currentDriver.firstName} ${car.currentDriver.lastName}`
                  : "-"}
              </td>
              <td className="p-3" onClick={stop}>
                <div className="flex justify-end gap-2">
                  {has(PERMISSIONS.CARS_UPDATE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.CAR_EDIT, { car })}
                      className="text-muted-foreground hover:text-foreground"
                      title="Tahrirlash"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {has(PERMISSIONS.CARS_DELETE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.CAR_DELETE, { car })}
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

export default CarsTable;
