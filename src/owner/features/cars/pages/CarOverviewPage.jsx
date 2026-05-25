import { Link, useOutletContext } from "react-router-dom";
import { User, CheckCircle2, XCircle } from "lucide-react";

import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import CarDocumentsSection from "../components/CarDocumentsSection";

const SummaryStat = ({ label, children }) => (
  <div className="bg-white border rounded-[2px] p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <div className="mt-1">{children}</div>
  </div>
);

const CarOverviewPage = () => {
  const { car } = useOutletContext();

  const driverName = car.currentDriver
    ? `${car.currentDriver.firstName} ${car.currentDriver.lastName}`
    : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryStat label="Holat">
          {car.isActive ? (
            <span className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm">
              <CheckCircle2 size={16} strokeWidth={2} /> Faol
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground font-semibold text-sm">
              <XCircle size={16} strokeWidth={2} /> Faol emas
            </span>
          )}
        </SummaryStat>

        <SummaryStat label="Davlat raqami">
          {car.plateNumber ? (
            <PlateNumber value={car.plateNumber} size="md" />
          ) : (
            <span className="text-sm font-medium">-</span>
          )}
        </SummaryStat>

        <SummaryStat label="Joriy haydovchi">
          {car.currentDriver ? (
            <Link
              to={`/owner/drivers/${car.currentDriver._id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <User size={14} strokeWidth={1.5} />
              {driverName}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">Biriktirilmagan</span>
          )}
        </SummaryStat>
      </div>

      <DetailSection title="Asosiy ma'lumotlar" defaultOpen>
        <KeyValueList
          columns={2}
          items={[
            { label: "Model", value: car.model },
            {
              label: "Telefon",
              value: car.currentDriver?.phone,
              href: car.currentDriver?.phone ? `tel:${car.currentDriver.phone}` : null,
              copyable: !!car.currentDriver?.phone,
            },
            { label: "Izoh", value: car.notes || "-", fullWidth: true },
          ]}
        />
      </DetailSection>

      <DetailSection title="Hujjatlar" defaultOpen>
        <CarDocumentsSection carId={car._id} documents={car.documents || []} />
      </DetailSection>
    </div>
  );
};

export default CarOverviewPage;
