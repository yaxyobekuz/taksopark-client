import { Link, useOutletContext } from "react-router-dom";
import { User, Phone } from "lucide-react";

import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { formatPhone } from "@/shared/utils/formatPhone";
import { formatDateUz } from "@/shared/utils/formatDate";
import { formatMoney } from "@/shared/utils/formatMoney";
import {
  TARIFF_LABELS,
  TARIFFS,
  TARIFF_TEXT_CLASS,
} from "@/shared/constants/tariffs";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_BADGE_CLASS,
} from "@/shared/constants/drivers";
import CarDocumentsSection from "../components/CarDocumentsSection";

const DriverPanel = ({ driver }) => {
  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-muted text-muted-foreground">
          <User size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium">Haydovchi biriktirilmagan</p>
        <p className="text-xs text-muted-foreground">
          Ushbu mashinaga hozircha haydovchi tayinlanmagan
        </p>
      </div>
    );
  }

  const photoUrl = buildFileUrl(driver.photoUrl);
  const initial = (driver.firstName?.[0] || "?").toUpperCase();
  const fullName = `${driver.firstName} ${driver.lastName || ""}`.trim();

  return (
    <Link to={`/owner/drivers/${driver._id}`} className="block group">
      <div className="flex items-start gap-3">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt=""
            className="size-12 rounded-full object-cover shrink-0 border"
          />
        ) : (
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {fullName}
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
          <p
            className={`text-xs mt-0.5 ${
              TARIFF_TEXT_CLASS[driver.tariff] || "text-muted-foreground"
            }`}
          >
            {TARIFF_LABELS[driver.tariff] || driver.tariff}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t space-y-2 text-xs">
        {driver.phone && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground inline-flex items-center gap-1.5">
              <Phone size={12} strokeWidth={1.5} /> Telefon
            </span>
            <a
              href={`tel:${driver.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-primary hover:underline"
            >
              {formatPhone(driver.phone)}
            </a>
          </div>
        )}
        {driver.startDate && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Boshlangan</span>
            <span className="font-medium">
              {formatDateUz(driver.startDate)}
            </span>
          </div>
        )}
        {driver.tariff === TARIFFS.DEPOSIT && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Depozit qoldig'i</span>
            <span className="font-medium">
              {formatMoney(driver.depositRemaining)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

const CarOverviewPage = () => {
  const { car } = useOutletContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DetailSection title="Asosiy ma'lumotlar" defaultOpen>
            <KeyValueList
              columns={2}
              items={[
                { label: "Model", value: car.model },
                { label: "Izoh", value: car.notes || "-", fullWidth: true },
              ]}
            />
          </DetailSection>
        </div>
        <div>
          <DetailSection title="Haydovchi" defaultOpen collapsible={false}>
            <DriverPanel driver={car.currentDriver} />
          </DetailSection>
        </div>
      </div>

      <DetailSection title="Hujjatlar" defaultOpen>
        <CarDocumentsSection carId={car._id} documents={car.documents || []} />
      </DetailSection>
    </div>
  );
};

export default CarOverviewPage;
