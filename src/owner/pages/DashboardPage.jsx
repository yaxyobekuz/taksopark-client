import { useState } from "react";
import {
  Car,
  Users,
  Bell,
  UserPlus,
  CalendarPlus,
  Ambulance,
  Wallet,
} from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import QuickAddFab from "@/shared/components/ui/fab/QuickAddFab";
import NotificationsPanel from "@/shared/components/ui/panel/NotificationsPanel";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { useDriversQuery, DriverCreateModal } from "@/owner/features/drivers";
import {
  useCarsExpiringQuery,
  useCarsQuery,
  CarCreateModal,
} from "@/owner/features/cars";
import { RestDayCreateModal } from "@/owner/features/restdays";
import { AddPaymentModal } from "@/owner/features/finance";

const DashboardPage = () => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: expiringCars = [], isLoading: expiringLoading } =
    useCarsExpiringQuery({ limit: 5, days: 30 });
  const { data: driversData, isLoading: driversLoading } = useDriversQuery({
    limit: 1,
    status: "working",
  });
  const { data: carsData, isLoading: carsLoading } = useCarsQuery({
    limit: 1,
    isActive: "true",
  });

  const activeDrivers = driversData?.meta?.total ?? 0;
  const activeCars = carsData?.meta?.total ?? 0;

  const totalWarnings = expiringCars.length;

  const quickActions = [
    {
      key: "driver",
      label: "Haydovchi",
      icon: UserPlus,
      permission: PERMISSIONS.DRIVERS_CREATE,
      onClick: () => openModal(MODAL.DRIVER_CREATE),
    },
    {
      key: "car",
      label: "Mashina",
      icon: Ambulance,
      permission: PERMISSIONS.CARS_CREATE,
      onClick: () => openModal(MODAL.CAR_CREATE),
    },
    {
      key: "rest-day",
      label: "Dam olish kuni",
      icon: CalendarPlus,
      permission: PERMISSIONS.REST_DAYS_MANAGE,
      onClick: () => openModal(MODAL.REST_DAY_CREATE),
    },
    {
      key: "payment",
      label: "Kunlik to'lov",
      icon: Wallet,
      permission: PERMISSIONS.PAYMENTS_MANAGE,
      onClick: () => openModal(MODAL.PAYMENT_ADD),
    },
  ].filter((a) => has(a.permission));

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">
            Xush kelibsiz, hurmatli foydalanuvchi! 🫡
          </h1>

          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            aria-label="Bildirishnomalar"
            className="relative flex items-center justify-center size-10 rounded-full border bg-white hover:bg-muted/60 transition-colors shrink-0"
          >
            <Bell size={20} className="text-foreground" />
            {totalWarnings > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[11px] font-semibold">
                {totalWarnings > 99 ? "99+" : totalWarnings}
              </span>
            )}
          </button>
        </div>

        {/* Park holati KPI */}
        <div className="grid grid-cols-2 gap-4">
          {driversLoading || carsLoading ? (
            <SkeletonStatCard count={2} />
          ) : (
            <>
              <StatCard
                label="Haydovchilar"
                value={activeDrivers}
                icon={Users}
              />
              <StatCard
                label="Mashinalar"
                value={activeCars}
                icon={Car}
              />
            </>
          )}
        </div>
      </div>

      <NotificationsPanel
        open={notifOpen}
        onOpenChange={setNotifOpen}
        expiringCars={expiringCars}
        isLoading={expiringLoading}
      />

      <ModalWrapper name={MODAL.DRIVER_CREATE} title="Yangi haydovchi qo'shish">
        <DriverCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_CREATE} title="Yangi mashina qo'shish">
        <CarCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.REST_DAY_CREATE} title="Yangi dam olish kuni">
        <RestDayCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.PAYMENT_ADD} title="Kunlik to'lov qo'shish" className="max-w-md">
        <AddPaymentModal />
      </ModalWrapper>

      <QuickAddFab actions={quickActions} />
    </div>
  );
};

export default DashboardPage;
