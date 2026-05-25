import { Link, useOutletContext } from "react-router-dom";
import { FileText, ShieldCheck } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import Badge from "@/shared/components/ui/badge/Badge";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
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

const DocumentCard = ({ icon: Icon, title, date }) => (
  <Card className="space-y-3">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon size={18} />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="text-2xl font-semibold">
      {date ? (
        formatDateUZ(date)
      ) : (
        <span className="text-muted-foreground text-base">Belgilanmagan</span>
      )}
    </div>
    <ExpiryBadge date={date} />
  </Card>
);

const CarOverviewPage = () => {
  const { car } = useOutletContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentCard
          icon={ShieldCheck}
          title="Litsenziya muddati"
          date={car.licenseExpiryDate}
        />
        <DocumentCard
          icon={FileText}
          title="Dovernost muddati"
          date={car.powerOfAttorneyExpiryDate}
        />
      </div>

      <Card title="Asosiy ma'lumotlar" className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
          <div>
            <p className="text-muted-foreground">Model</p>
            <p className="font-medium">{car.model}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Davlat raqami</p>
            <div className="mt-1">
              {car.plateNumber ? <PlateNumber value={car.plateNumber} size="md" /> : <span className="font-medium">-</span>}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Joriy haydovchi</p>
            {car.currentDriver ? (
              <Link
                to={`/owner/drivers/${car.currentDriver._id}`}
                className="font-medium text-primary hover:underline"
              >
                {car.currentDriver.firstName} {car.currentDriver.lastName}
                {car.currentDriver.phone ? ` · ${car.currentDriver.phone}` : ""}
              </Link>
            ) : (
              <p className="font-medium text-muted-foreground">
                Biriktirilmagan
              </p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">Holat</p>
            <p
              className={
                car.isActive
                  ? "text-green-600 font-medium"
                  : "text-muted-foreground font-medium"
              }
            >
              {car.isActive ? "Faol" : "Faol emas"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-muted-foreground">Izoh</p>
            <p className="font-medium whitespace-pre-line">
              {car.notes || "-"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CarOverviewPage;
