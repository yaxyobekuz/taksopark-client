import { Link, Outlet, useParams } from "react-router-dom";
import { ArrowLeft, Car } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import { buildFileUrl } from "@/shared/utils/fileUrl";
import usePermissions from "@/shared/hooks/usePermissions";
import useModal from "@/shared/hooks/useModal";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { driverStatusBadge } from "@/shared/constants/drivers";

import { useDriverQuery } from "../hooks/useDriversQuery";
import DriverChangeCarModal from "../components/modals/DriverChangeCarModal";
import DriverDocumentCreateModal from "../components/modals/DriverDocumentCreateModal";
import DriverDocumentEditModal from "../components/modals/DriverDocumentEditModal";
import DriverDocumentDeleteModal from "../components/modals/DriverDocumentDeleteModal";

const DriverDetailLayout = () => {
  const { id } = useParams();
  const { data: driver, isLoading } = useDriverQuery(id);
  const { has } = usePermissions();
  const { openModal } = useModal();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard count={2} />
      </div>
    );
  }
  if (!driver) {
    return (
      <div className="space-y-4">
        <Link
          to="/owner/drivers"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} className="mr-1" /> Haydovchilar
        </Link>
        <EmptyState title="Haydovchi topilmadi" />
      </div>
    );
  }

  const tabs = [{ to: `/owner/drivers/${id}`, label: "Asosiy", exact: true }];
  if (has(PERMISSIONS.WORK_PERIODS_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/work-periods`, label: "Ish davrlari" });
  }
  if (has(PERMISSIONS.PAYMENTS_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/payments`, label: "Kunlik to'lovlar" });
  }
  if (has(PERMISSIONS.FINES_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/fines`, label: "Jarimalar" });
  }
  if (has(PERMISSIONS.DAMAGES_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/damages`, label: "Zararlar" });
  }

  return (
    <div className="space-y-4">
      <Link
        to="/owner/drivers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} className="mr-1" /> Haydovchilar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {(() => {
            const photoUrl = buildFileUrl(driver.photoUrl);
            const initial = (driver.firstName?.[0] || "?").toUpperCase();
            return photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="size-14 rounded-full object-cover border shrink-0"
              />
            ) : (
              <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary font-semibold text-lg shrink-0">
                {initial}
              </div>
            );
          })()}
          <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              {driver.firstName} {driver.lastName}
            </h1>
            {(() => {
              const status = driverStatusBadge(driver);
              return (
                <span className={`text-[11px] px-1.5 py-0.5 rounded shrink-0 ${status.className}`}>
                  {status.label}
                </span>
              );
            })()}
          </div>
          <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
            {driver.phone && (
              <a
                href={`tel:${driver.phone}`}
                className="hover:text-primary"
              >
                {driver.phone}
              </a>
            )}
            <span>·</span>
            {driver.car ? (
              <Link
                to={`/owner/cars/${driver.car._id}`}
                className="inline-flex items-center align-middle hover:text-primary"
              >
                {driver.car.plateNumber ? (
                  <PlateNumber value={driver.car.plateNumber} size="sm" />
                ) : (
                  driver.car.model
                )}
              </Link>
            ) : (
              <span>Mashina biriktirilmagan</span>
            )}
          </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {has(PERMISSIONS.DRIVERS_UPDATE) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openModal(MODAL.DRIVER_CHANGE_CAR, { driver })}
            >
              <Car size={14} className="mr-1.5" />
              Mashinani almashtirish
            </Button>
          )}
        </div>
      </div>

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-2 bg-background border-b">
        <TabsLinks
          items={tabs}
          listClassName="overflow-x-auto scrollbar-hide"
        />
      </div>

      <Outlet context={{ driver }} />

      <ModalWrapper
        name={MODAL.DRIVER_CHANGE_CAR}
        title="Mashinani almashtirish"
        className="max-w-md"
      >
        <DriverChangeCarModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_DOC_CREATE} title="Hujjat qo'shish">
        <DriverDocumentCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_DOC_EDIT} title="Hujjatni tahrirlash">
        <DriverDocumentEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_DOC_DELETE} title="O'chirishni tasdiqlash">
        <DriverDocumentDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverDetailLayout;
