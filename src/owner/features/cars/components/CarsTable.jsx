import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, RotateCcw } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { formatMoney } from "@/shared/utils/formatMoney";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { useCarRestore } from "../hooks/useCarMutations";

const stop = (e) => e.stopPropagation();

// Mashinaning bugun faol narx davridagi kunlik narxlari (DERIVED holat).
const ActivePriceCell = ({ price }) => {
  if (!price) {
    return (
      <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
        Narx belgilanmagan
      </span>
    );
  }
  return (
    <div className="text-xs leading-tight whitespace-nowrap">
      <div>
        <span className="text-muted-foreground">Depozit:</span>{" "}
        <span className="font-medium">{formatMoney(price.dailyRateDeposit)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Keshbek:</span>{" "}
        <span className="font-medium">{formatMoney(price.dailyRateCashback)}</span>
      </div>
    </div>
  );
};

const CarsTable = ({ items = [], isArchived = false }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();
  const carRestore = useCarRestore();

  if (!items.length) {
    return <p className="text-sm text-muted-foreground p-4">Mashina yo'q</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Model</th>
            <th className="text-left p-3">Davlat raqami</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Faol narx</th>
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
                <PlateNumber value={car.plateNumber} size="sm" />
              </td>
              <td className="p-3">
                {car.currentDriver
                  ? `${car.currentDriver.firstName} ${car.currentDriver.lastName}`
                  : "-"}
              </td>
              <td className="p-3">
                <ActivePriceCell price={car.activePrice} />
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
                  {has(PERMISSIONS.CARS_DELETE) &&
                    (isArchived ? (
                      <button
                        type="button"
                        onClick={() => carRestore.mutate(car._id)}
                        disabled={carRestore.isPending}
                        className="text-muted-foreground hover:text-green-600 disabled:opacity-50"
                        title="Tiklash"
                      >
                        <RotateCcw size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openModal(MODAL.CAR_DELETE, { car })}
                        className="text-muted-foreground hover:text-red-600"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    ))}
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
