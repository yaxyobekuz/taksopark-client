import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, FileText, ShieldCheck } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import Badge from "@/shared/components/ui/badge/Badge";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useCarByIdQuery } from "../hooks/useCarByIdQuery";
import { getExpiryStatus, getDaysLeft } from "../utils/expiryStatus";
import CarEditModal from "../components/modals/CarEditModal";

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

const CarDetailPage = () => {
  const { id } = useParams();
  const { openModal } = useModal();
  const { has } = usePermissions();
  const { data: car, isLoading } = useCarByIdQuery(id);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  }

  if (!car) {
    return (
      <div className="space-y-4">
        <Link
          to="/owner/cars"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} /> Mashinalar ro'yxati
        </Link>
        <p className="text-sm text-red-600">Mashina topilmadi</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/owner/cars"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} /> Mashinalar ro'yxati
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{car.model}</h1>

        {has(PERMISSIONS.CARS_UPDATE) && (
          <Button onClick={() => openModal(MODAL.CAR_EDIT, { car })}>
            <Pencil size={16} className="mr-2" /> Tahrirlash
          </Button>
        )}
      </div>

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
            <p className="font-medium">{car.plateNumber || "-"}</p>
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

      <ModalWrapper name={MODAL.CAR_EDIT} title="Mashinani tahrirlash">
        <CarEditModal />
      </ModalWrapper>
    </div>
  );
};

export default CarDetailPage;
