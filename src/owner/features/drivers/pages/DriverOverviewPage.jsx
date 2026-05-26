import { Link, useOutletContext, useParams } from "react-router-dom";
import { Car as CarIcon, CheckCircle2, XCircle } from "lucide-react";

import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { formatMoney } from "@/shared/utils/formatMoney";
import {
  TARIFFS,
  TARIFF_LABELS,
  TARIFF_TEXT_CLASS,
} from "@/shared/constants/tariffs";
import { useDriverBalanceQuery } from "../hooks/useDriversQuery";
import { useCarByIdQuery } from "@/owner/features/cars";
import WarningBadge from "../components/WarningBadge";
import DriverDocumentsSection from "../components/DriverDocumentsSection";

const PHASE_LABELS = {
  deposit: "Depozit",
  salary: "Oylik",
};

const DriverOverviewPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  const { data: balance, isLoading: balanceLoading } = useDriverBalanceQuery(id);
  const { data: fullCar } = useCarByIdQuery(driver.car?._id);
  const car = fullCar || driver.car;

  const tariff = balance?.tariff ?? driver.tariff;
  const phase = balance?.phase;
  const deposit = balance?.deposit;
  const oylik = balance?.oylik;
  const warnings = balance?.warnings || [];

  const tariffNode = tariff ? (
    <span className={TARIFF_TEXT_CLASS[tariff] || "font-medium"}>
      {TARIFF_LABELS[tariff] || tariff}
    </span>
  ) : (
    "-"
  );

  const phaseLabel = phase?.phase
    ? phase.phase === "trial"
      ? `Sinov (${phase.trialDaysLeft} kun qoldi)`
      : PHASE_LABELS[phase.phase]
    : null;

  const items = [
    {
      label: "Telefon",
      value: driver.phone,
      href: driver.phone ? `tel:${driver.phone}` : null,
      copyable: !!driver.phone,
    },
    {
      label: "Ish boshlagan",
      value: driver.startDate ? formatDateUZ(driver.startDate) : "-",
    },
    { label: "Tarif", value: tariffNode },
    phaseLabel ? { label: "Holat", value: phaseLabel } : null,
    driver.trialEndedAt
      ? {
          label: "Sinov tugagan",
          value: formatDateUZ(driver.trialEndedAt),
        }
      : null,
    tariff === TARIFFS.DEPOSIT && deposit
      ? {
          label: "Boshlang'ich depozit",
          value: formatMoney(deposit.initial),
        }
      : null,
    tariff === TARIFFS.DEPOSIT && deposit
      ? {
          label: "Qolgan depozit",
          value: (
            <span className="font-semibold text-primary">
              {formatMoney(deposit.remaining)}
            </span>
          ),
        }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik
      ? {
          label: "Joriy oylik davri",
          value: `${formatDateUZ(oylik.startDate)} - ${formatDateUZ(oylik.endDate)}`,
        }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik
      ? {
          label: "Oylik muddati",
          value: (
            <span>
              {formatDateUZ(oylik.dueDate)}
              {oylik.isLate && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-semibold text-xs">
                  {oylik.lateDays} kun kechikkan
                </span>
              )}
            </span>
          ),
        }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik
      ? { label: "Oylik", value: formatMoney(oylik.salary) }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik && oylik.expectedPlanTotal > 0
      ? {
          label: "Yig'ilgan to'lov",
          value: formatMoney(oylik.paidTotal),
        }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik && oylik.expectedPlanTotal > 0
      ? {
          label: "Oylik reja",
          value: formatMoney(oylik.expectedPlanTotal),
        }
      : null,
    tariff === TARIFFS.NO_DEPOSIT && oylik && oylik.expectedPlanTotal > 0
      ? {
          label: "Plan qoldig'i",
          value: formatMoney(oylik.planDeficit),
        }
      : null,
    driver.notes
      ? { label: "Izoh", value: driver.notes, fullWidth: true }
      : null,
  ];

  return (
    <div className="space-y-4">
      <DetailSection title="Umumiy ma'lumot" defaultOpen>
        {balanceLoading ? (
          <SkeletonCard count={1} />
        ) : (
          <div className="space-y-3">
            <KeyValueList columns={2} items={items} />
            {warnings.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {warnings.map((w) => (
                  <WarningBadge key={w.code} code={w.code} />
                ))}
              </div>
            )}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Hujjatlar" defaultOpen>
        <DriverDocumentsSection driverId={driver._id} documents={driver.documents || []} />
      </DetailSection>

      <DetailSection title="Mashina" defaultOpen>
        {car ? (
          <Link
            to={`/owner/cars/${car._id}`}
            className="flex items-start gap-3 group"
          >
            {buildFileUrl(car.photoUrl) ? (
              <img
                src={buildFileUrl(car.photoUrl)}
                alt=""
                className="size-16 sm:size-20 rounded-md object-cover border shrink-0"
              />
            ) : (
              <div className="flex items-center justify-center size-16 sm:size-20 rounded-md bg-primary/10 text-primary shrink-0">
                <CarIcon size={28} strokeWidth={1.5} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold truncate group-hover:text-primary">
                  {car.model}
                </h3>
                {car.isActive === false ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                    <XCircle size={11} strokeWidth={2} /> Faol emas
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                    <CheckCircle2 size={11} strokeWidth={2} /> Faol
                  </span>
                )}
              </div>
              <div className="mt-1.5">
                {car.plateNumber ? (
                  <PlateNumber value={car.plateNumber} size="sm" />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Raqam belgilanmagan
                  </span>
                )}
              </div>
              {car.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {car.notes}
                </p>
              )}
            </div>
          </Link>
        ) : (
          <p className="text-sm text-muted-foreground">
            Mashina biriktirilmagan
          </p>
        )}
      </DetailSection>
    </div>
  );
};

export default DriverOverviewPage;
