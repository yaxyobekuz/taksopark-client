import { Link, Outlet, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import usePermissions from "@/shared/hooks/usePermissions";
import useModal from "@/shared/hooks/useModal";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { useCarByIdQuery } from "../hooks/useCarByIdQuery";
import CarEditModal from "../components/modals/CarEditModal";

const CarDetailLayout = () => {
  const { id } = useParams();
  const { data: car, isLoading } = useCarByIdQuery(id);
  const { has } = usePermissions();
  const { openModal } = useModal();

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

  const tabs = [{ to: `/owner/cars/${id}`, label: "Asosiy", exact: true }];
  if (has(PERMISSIONS.REPORTS_READ)) {
    tabs.push({ to: `/owner/cars/${id}/moliya`, label: "Moliya" });
  }

  return (
    <div className="space-y-4">
      <Link
        to="/owner/cars"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} /> Mashinalar ro'yxati
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold">{car.model}</h1>
        {has(PERMISSIONS.CARS_UPDATE) && (
          <Button onClick={() => openModal(MODAL.CAR_EDIT, { car })}>
            <Pencil size={16} className="mr-2" /> Tahrirlash
          </Button>
        )}
      </div>

      <TabsLinks items={tabs} />

      <Outlet context={{ car }} />

      <ModalWrapper name={MODAL.CAR_EDIT} title="Mashinani tahrirlash">
        <CarEditModal />
      </ModalWrapper>
    </div>
  );
};

export default CarDetailLayout;
