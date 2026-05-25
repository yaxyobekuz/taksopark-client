import { Link, useOutletContext, useParams } from "react-router-dom";
import { Car as CarIcon } from "lucide-react";

import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useDriverBalanceQuery } from "../hooks/useDriversQuery";
import DriverBalancePanel from "../components/DriverBalancePanel";

const DriverOverviewPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  const { data: balance, isLoading: balanceLoading } = useDriverBalanceQuery(id);

  return (
    <div className="space-y-4">
      {balanceLoading ? (
        <SkeletonCard count={1} />
      ) : (
        <DriverBalancePanel balance={balance} isLoading={false} />
      )}

      <DetailSection title="Umumiy ma'lumot" defaultOpen>
        <KeyValueList
          columns={2}
          items={[
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
            driver.notes
              ? { label: "Izoh", value: driver.notes, fullWidth: true }
              : null,
          ]}
        />
      </DetailSection>

      <DetailSection title="Mashina" defaultOpen>
        {driver.car ? (
          <Link
            to={`/owner/cars/${driver.car._id}`}
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center size-10 rounded-md bg-primary/10 text-primary shrink-0">
              <CarIcon size={20} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {driver.car.plateNumber ? (
                  <PlateNumber value={driver.car.plateNumber} size="sm" />
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5 group-hover:text-primary">
                {driver.car.model}
              </p>
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
