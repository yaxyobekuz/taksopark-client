import { useNavigate } from "react-router-dom";

import ProgressBar from "@/shared/components/ui/progress/ProgressBar";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { formatMoney } from "@/shared/utils/formatMoney";
import { TARIFF_LABELS, TARIFF_TEXT_CLASS } from "@/shared/constants/tariffs";

const DepositDriverProgressRow = ({ row }) => {
  const navigate = useNavigate();
  const photoUrl = buildFileUrl(row.photoUrl);
  const initial = (row.firstName?.[0] || "?").toUpperCase();

  return (
    <div
      onClick={() => navigate(`/owner/drivers/${row.driverId}`)}
      className="rounded-lg border bg-white p-3 sm:p-4 cursor-pointer hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              className="size-9 rounded-full object-cover border shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium truncate">
              {row.lastName} {row.firstName}
              {row.tariff && (
                <span className={`ml-1.5 text-xs ${TARIFF_TEXT_CLASS[row.tariff] || ""}`}>
                  {TARIFF_LABELS[row.tariff] || row.tariff}
                </span>
              )}
            </p>
            {row.car?.plateNumber && (
              <div className="mt-0.5">
                <PlateNumber value={row.car.plateNumber} size="sm" />
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold tabular-nums">{row.percent}%</p>
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={row.percent} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">
            Kutilayotgan
            {row.restDays > 0 && (
              <span className="ml-1 text-amber-600">({row.restDays} dam)</span>
            )}
          </p>
          <p className="font-medium">{formatMoney(row.expected)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">To'langan</p>
          <p className="font-medium text-emerald-600">{formatMoney(row.paid)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Qarz</p>
          <p className={`font-medium ${row.debt > 0 ? "text-red-600" : "text-muted-foreground"}`}>
            {formatMoney(row.debt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositDriverProgressRow;
