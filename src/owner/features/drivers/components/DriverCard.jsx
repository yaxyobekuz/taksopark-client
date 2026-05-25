import { useNavigate } from "react-router-dom";
import { ChevronRight, Pencil, Trash2 } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  TARIFF_LABELS,
  TARIFFS,
  TARIFF_TEXT_CLASS,
} from "@/shared/constants/tariffs";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_BADGE_CLASS,
} from "@/shared/constants/drivers";
import { formatMoney } from "@/shared/utils/formatMoney";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";

const DriverCard = ({ driver }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();

  const initial = (driver.firstName?.[0] || "?").toUpperCase();
  const photoUrl = buildFileUrl(driver.photoUrl);

  return (
    <div
      onClick={() => navigate(`/owner/drivers/${driver._id}`)}
      className="bg-white border rounded-[2px] p-3 active:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="size-10 rounded-full object-cover shrink-0 border"
          />
        ) : (
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
            {initial}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">
              {driver.firstName} {driver.lastName}
            </p>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                DRIVER_STATUS_BADGE_CLASS[driver.status] ||
                "bg-gray-100 text-gray-600"
              }`}
            >
              {DRIVER_STATUS_LABELS[driver.status] || driver.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span className="truncate">{driver.phone || "-"}</span>
            <span>·</span>
            <span className={TARIFF_TEXT_CLASS[driver.tariff]}>
              {TARIFF_LABELS[driver.tariff] || driver.tariff}
            </span>
          </div>
        </div>

        <ChevronRight
          size={18}
          strokeWidth={1.5}
          className="text-muted-foreground shrink-0"
        />
      </div>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t text-xs">
        <div className="flex items-center gap-2 min-w-0">
          {driver.car?.plateNumber ? (
            <PlateNumber value={driver.car.plateNumber} size="sm" />
          ) : (
            <span className="text-muted-foreground">Mashina yo'q</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {driver.tariff === TARIFFS.DEPOSIT && (
            <span className="font-medium">
              {formatMoney(driver.depositRemaining)}
            </span>
          )}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {has(PERMISSIONS.DRIVERS_UPDATE) && (
              <button
                type="button"
                onClick={() => openModal(MODAL.DRIVER_EDIT, { driver })}
                className="p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Tahrirlash"
              >
                <Pencil size={14} />
              </button>
            )}
            {has(PERMISSIONS.DRIVERS_DELETE) && (
              <button
                type="button"
                onClick={() => openModal(MODAL.DRIVER_DELETE, { driver })}
                className="p-1.5 text-muted-foreground hover:text-red-600"
                aria-label="Arxivlash"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCard;
