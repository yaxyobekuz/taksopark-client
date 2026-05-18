import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { getExpiryStatus } from "../utils/expiryStatus";

const ExpiryCell = ({ date }) => {
  const status = getExpiryStatus(date);
  if (status === "unset") return <span className="text-muted-foreground">-</span>;
  const cls =
    status === "expired"
      ? "text-red-600 font-medium"
      : status === "expiring_soon"
        ? "text-amber-600 font-medium"
        : "text-foreground";
  return <span className={cls}>{formatDateUZ(date)}</span>;
};

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
            <th className="text-left p-3">Litsenziya</th>
            <th className="text-left p-3">Dovernost</th>
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
              <td className="p-3 font-medium">{car.plateNumber || "-"}</td>
              <td className="p-3">{car.model}</td>
              <td className="p-3"><ExpiryCell date={car.licenseExpiryDate} /></td>
              <td className="p-3"><ExpiryCell date={car.powerOfAttorneyExpiryDate} /></td>
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
