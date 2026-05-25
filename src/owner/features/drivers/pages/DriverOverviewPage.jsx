import { Link, useOutletContext, useParams } from "react-router-dom";
import Card from "@/shared/components/ui/card/Card";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useDriverBalanceQuery } from "../hooks/useDriversQuery";
import DriverBalancePanel from "../components/DriverBalancePanel";

const DriverOverviewPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  const { data: balance, isLoading: balanceLoading } = useDriverBalanceQuery(id);

  return (
    <div className="space-y-4">
      <DriverBalancePanel balance={balance} isLoading={balanceLoading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Umumiy ma'lumot" className="space-y-2">
          <p className="text-sm mt-3">
            <span className="text-muted-foreground">Telefon:</span>{" "}
            <a href={`tel:${driver.phone}`} className="text-primary hover:underline">
              {driver.phone}
            </a>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Ish boshlagan:</span>{" "}
            {formatDateUZ(driver.startDate)}
          </p>
          {driver.notes && (
            <p className="text-sm whitespace-pre-wrap">
              <span className="text-muted-foreground">Izoh:</span>{" "}
              {driver.notes}
            </p>
          )}
        </Card>

        <Card title="Mashina" className="space-y-2">
          {driver.car ? (
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Raqami:</span>
                <Link
                  to={`/owner/cars/${driver.car._id}`}
                  className="inline-flex items-center hover:opacity-80"
                >
                  {driver.car.plateNumber ? (
                    <PlateNumber value={driver.car.plateNumber} size="sm" />
                  ) : (
                    <span>-</span>
                  )}
                </Link>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Model:</span>{" "}
                {driver.car.model}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-3">
              Mashina biriktirilmagan
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DriverOverviewPage;
