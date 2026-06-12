import { Link, useOutletContext } from "react-router-dom";
import { Car as CarIcon, CheckCircle2, XCircle } from "lucide-react";

import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { driverStatusBadge } from "@/shared/constants/drivers";
import { useCarByIdQuery } from "@/owner/features/cars";
import DriverDocumentsSection from "../components/DriverDocumentsSection";

const DriverOverviewPage = () => {
  const { driver } = useOutletContext();
  const { data: fullCar } = useCarByIdQuery(driver.car?._id);
  const car = fullCar || driver.car;
  const status = driverStatusBadge(driver);

  const items = [
    {
      label: "Telefon",
      value: driver.phone,
      href: driver.phone ? `tel:${driver.phone}` : null,
      copyable: !!driver.phone,
    },
    {
      label: "Ish boshlagan",
      value: driver.firstWorkDate ? formatDateUZ(driver.firstWorkDate) : "-",
    },
    {
      label: "Holat",
      value: status.label,
    },
    driver.notes
      ? { label: "Izoh", value: driver.notes, fullWidth: true }
      : null,
  ];

  return (
    <div className="space-y-4">
      <DetailSection title="Umumiy ma'lumot" defaultOpen>
        <KeyValueList columns={2} items={items} />
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
