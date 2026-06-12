import { Link, Outlet, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import { buildFileUrl } from "@/shared/utils/fileUrl";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";

import { useCarByIdQuery } from "../hooks/useCarByIdQuery";
import CarDocumentCreateModal from "../components/modals/CarDocumentCreateModal";
import CarDocumentEditModal from "../components/modals/CarDocumentEditModal";
import CarDocumentDeleteModal from "../components/modals/CarDocumentDeleteModal";

const CarDetailLayout = () => {
  const { id } = useParams();
  const { data: car, isLoading } = useCarByIdQuery(id);
  const { has } = usePermissions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard count={2} />
      </div>
    );
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
        <EmptyState title="Mashina topilmadi" />
      </div>
    );
  }

  const tabs = [{ to: `/owner/cars/${id}`, label: "Asosiy", exact: true }];
  if (has(PERMISSIONS.CAR_PRICES_READ)) {
    tabs.push({ to: `/owner/cars/${id}/narxlar`, label: "To'lov narxlari" });
  }
  if (has(PERMISSIONS.CARS_UPDATE)) {
    tabs.push({ to: `/owner/cars/${id}/tahrirlash`, label: "Tahrirlash" });
  }

  return (
    <div className="space-y-4">
      <Link
        to="/owner/cars"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} /> Mashinalar ro'yxati
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          {buildFileUrl(car.photoUrl) ? (
            <img
              src={buildFileUrl(car.photoUrl)}
              alt=""
              className="size-14 rounded-md object-cover border shrink-0"
            />
          ) : null}
          <h1 className="text-lg sm:text-xl font-semibold truncate">
            {car.model}
          </h1>
          {car.isActive ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
              <CheckCircle2 size={12} strokeWidth={2} /> Faol
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
              <XCircle size={12} strokeWidth={2} /> Faol emas
            </span>
          )}
          {car.plateNumber && <PlateNumber value={car.plateNumber} size="md" />}
        </div>
      </div>

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-2 bg-background border-b">
        <TabsLinks
          items={tabs}
          listClassName="overflow-x-auto scrollbar-hide"
        />
      </div>

      <Outlet context={{ car }} />

      <ModalWrapper name={MODAL.CAR_DOC_CREATE} title="Hujjat qo'shish">
        <CarDocumentCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_DOC_EDIT} title="Hujjatni tahrirlash">
        <CarDocumentEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_DOC_DELETE} title="O'chirishni tasdiqlash">
        <CarDocumentDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default CarDetailLayout;
