import { Link, useOutletContext } from "react-router-dom";
import { FileText, ShieldCheck, User, CheckCircle2, XCircle } from "lucide-react";

import Badge from "@/shared/components/ui/badge/Badge";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { getExpiryStatus, getDaysLeft } from "../utils/expiryStatus";

const ExpiryBadge = ({ date }) => {
  const status = getExpiryStatus(date);
  if (status === "unset") return <Badge variant="outline">Belgilanmagan</Badge>;
  if (status === "expired") {
    const days = -getDaysLeft(date);
    return <Badge variant="destructive">Muddati o'tgan ({days} kun)</Badge>;
  }
  if (status === "expiring_soon") {
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">
        Tez orada ({getDaysLeft(date)} kun qoldi)
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
      Joriy
    </Badge>
  );
};

const DocumentRow = ({ icon: Icon, title, date }) => (
  <div className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0 border-b last:border-b-0">
    <div className="flex items-center gap-2 min-w-0">
      <Icon size={18} strokeWidth={1.5} className="text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-muted-foreground">
          {date ? formatDateUZ(date) : "Belgilanmagan"}
        </p>
      </div>
    </div>
    <ExpiryBadge date={date} />
  </div>
);

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

      <DetailSection title="Hujjatlar" defaultOpen={false}>
        <div>
          <DocumentRow
            icon={ShieldCheck}
            title="Litsenziya muddati"
            date={car.licenseExpiryDate}
          />
          <DocumentRow
            icon={FileText}
            title="Dovernost muddati"
            date={car.powerOfAttorneyExpiryDate}
          />
        </div>
      </DetailSection>
    </div>
  );
};

export default CarOverviewPage;
