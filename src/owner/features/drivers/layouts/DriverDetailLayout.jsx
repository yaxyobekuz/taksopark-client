import { Link, Outlet, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import usePermissions from "@/shared/hooks/usePermissions";
import useModal from "@/shared/hooks/useModal";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { TARIFFS, TARIFF_LABELS, TARIFF_TEXT_CLASS } from "@/shared/constants/tariffs";
import { useDriverQuery } from "../hooks/useDriversQuery";
import { useDriverRecompute } from "../hooks/useDriverMutations";
import DriverEndTrialModal from "../components/modals/DriverEndTrialModal";

const DriverDetailLayout = () => {
  const { id } = useParams();
  const { data: driver, isLoading } = useDriverQuery(id);
  const { mutate: recompute, isPending: recomputing } = useDriverRecompute();
  const { has } = usePermissions();
  const { openModal } = useModal();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
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
        <p className="text-sm text-red-600">Haydovchi topilmadi</p>
      </div>
    );
  }

  const tabs = [{ to: `/owner/drivers/${id}`, label: "Asosiy", exact: true }];
  if (has(PERMISSIONS.PAYMENTS_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/payments`, label: "To'lovlar" });
  }
  if (has(PERMISSIONS.FINES_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/fines`, label: "Jarimalar" });
  }
  if (has(PERMISSIONS.DAMAGES_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/damages`, label: "Zararlar" });
  }
  if (has(PERMISSIONS.OYLIKLAR_READ)) {
    tabs.push({ to: `/owner/drivers/${id}/oyliklar`, label: "Oyliklar" });
  }

  return (
    <div className="space-y-4">
      <Link
        to="/owner/drivers"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} className="mr-1" /> Haydovchilar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {driver.firstName} {driver.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            <a href={`tel:${driver.phone}`} className="hover:text-primary">
              {driver.phone}
            </a>{" "}
            ·{" "}
            <span className={TARIFF_TEXT_CLASS[driver.tariff]}>
              {TARIFF_LABELS[driver.tariff]}
            </span>{" "}
            ·{" "}
            {driver.car ? (
              <Link
                to={`/owner/cars/${driver.car._id}`}
                className="hover:text-primary"
              >
                {driver.car.plateNumber || driver.car.model}
              </Link>
            ) : (
              "Mashina biriktirilmagan"
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {has(PERMISSIONS.DRIVERS_END_TRIAL) &&
            driver.tariff === TARIFFS.NO_DEPOSIT && (
              <Button
                variant="outline"
                onClick={() => openModal(MODAL.DRIVER_END_TRIAL, { driver })}
              >
                <ShieldCheck size={14} className="mr-2" />
                {driver.trialEndedAt
                  ? "Sinov sanasini o'zgartirish"
                  : "Sinovni tugatish"}
              </Button>
            )}
          {has(PERMISSIONS.DRIVERS_UPDATE) && (
            <Button
              variant="outline"
              onClick={() => recompute(id)}
              disabled={recomputing}
            >
              <RefreshCw size={14} className="mr-2" />
              Balansni qayta hisoblash
            </Button>
          )}
        </div>
      </div>

      <TabsLinks items={tabs} />

      <Outlet context={{ driver }} />

      <ModalWrapper name={MODAL.DRIVER_END_TRIAL} title="Sinov muddatini tugatish" className="max-w-md">
        <DriverEndTrialModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverDetailLayout;
