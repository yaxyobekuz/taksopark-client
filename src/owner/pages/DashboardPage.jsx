import { useState } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  LineChartIcon,
  Scale,
  Car,
  Users,
  Bell,
  UserPlus,
  CalendarPlus,
  Ambulance,
  BanknoteArrowDown,
} from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";
import Card from "@/shared/components/ui/card/Card";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import QuickAddFab from "@/shared/components/ui/fab/QuickAddFab";
import NotificationsPanel from "@/shared/components/ui/panel/NotificationsPanel";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  useMonthlyIncomeExpenseQuery,
  useDailyIncomeExpenseQuery,
  MonthlyIncomeExpenseChart,
  DailyIncomeExpenseChart,
  PaymentCreateModal,
} from "@/owner/features/payments";
import {
  useDriverWarningsQuery,
  useDriversQuery,
  DriverCreateModal,
} from "@/owner/features/drivers";
import { useTransactionsSummaryQuery } from "@/owner/features/transactions";
import {
  useCarsExpiringQuery,
  useCarsQuery,
  CarCreateModal,
} from "@/owner/features/cars";
import { RestDayCreateModal } from "@/owner/features/restdays";

const today = new Date().toISOString().slice(0, 10);

const DashboardPage = () => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: warnings, isLoading: warningsLoading } =
    useDriverWarningsQuery();
  const { data: expiringCars = [], isLoading: expiringLoading } =
    useCarsExpiringQuery({ limit: 5, days: 30 });
  const { data: todaySummary, isLoading: todayLoading } =
    useTransactionsSummaryQuery({ fromDate: today, toDate: today });
  const { data: monthly, isLoading: monthlyLoading } =
    useMonthlyIncomeExpenseQuery();
  const { data: daily, isLoading: dailyLoading } =
    useDailyIncomeExpenseQuery(30);
  const { data: driversData, isLoading: driversLoading } = useDriversQuery({
    limit: 1,
    status: "active",
  });
  const { data: carsData, isLoading: carsLoading } = useCarsQuery({
    limit: 1,
    isActive: "true",
  });

  const months = monthly?.months || [];
  const thisMonth = months[months.length - 1] || {
    income: 0,
    expense: 0,
    profit: 0,
  };

  const depositLow = warnings?.depositLow || [];
  const depositEmpty = warnings?.depositEmpty || [];
  const noPayment = warnings?.noPayment2Days || [];

  const activeDrivers = driversData?.meta?.total ?? 0;
  const activeCars = carsData?.meta?.total ?? 0;

  const totalWarnings =
    depositEmpty.length +
    depositLow.length +
    noPayment.length +
    expiringCars.length;

  const kpiLoading = warningsLoading || expiringLoading;

  const quickActions = [
    {
      key: "payment",
      label: "To'lov",
      icon: BanknoteArrowDown,
      permission: PERMISSIONS.PAYMENTS_CREATE,
      onClick: () => openModal(MODAL.PAYMENT_CREATE),
    },
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

        {/* Bugungi moliya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayLoading ? (
            <SkeletonStatCard count={3} />
          ) : (
            <>
              <StatCard
                label="Bugungi park daromadi"
                value={todaySummary?.income || 0}
                isMoney
                tone="positive"
                icon={ArrowDownCircle}
              />
              <StatCard
                label="Bugungi park xarajati"
                value={todaySummary?.expense || 0}
                isMoney
                tone="warn"
                icon={ArrowUpCircle}
              />
              <StatCard
                label="Bugungi sof foyda"
                value={todaySummary?.balance || 0}
                isMoney
                tone={(todaySummary?.balance || 0) >= 0 ? "positive" : "warn"}
                icon={Wallet}
              />
            </>
          )}
        </div>

        <Card
          title="So'nggi 30 kun - Park daromad/xarajat"
          icon={<LineChartIcon size={20} className="text-primary" />}
        >
          <div className="mt-3">
            {!dailyLoading && (daily?.items || []).length === 0 ? (
              <EmptyState
                icon={LineChartIcon}
                title="Ma'lumot yo'q"
                description="So'nggi 30 kun ichida kirim-chiqim mavjud emas"
              />
            ) : (
              <DailyIncomeExpenseChart
                data={daily?.items || []}
                isLoading={dailyLoading}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {monthlyLoading ? (
            <SkeletonStatCard count={3} />
          ) : (
            <>
              <StatCard
                label="Bu oy park daromadi"
                value={thisMonth.income}
                isMoney
                icon={ArrowDownCircle}
              />
              <StatCard
                label="Bu oy park xarajati"
                value={thisMonth.expense}
                isMoney
                icon={ArrowUpCircle}
              />
              <StatCard
                label="Bu oy sof foyda"
                value={thisMonth.profit}
                isMoney
                tone={thisMonth.profit >= 0 ? "" : "negative"}
                icon={Scale}
              />
            </>
          )}
        </div>

        <Card
          title="So'nggi 12 oy - Park daromad/xarajat"
          icon={<BarChart3 className="text-primary" />}
        >
          <div className="mt-3">
            {!monthlyLoading && months.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="Ma'lumot yo'q"
                description="So'nggi 12 oy ichida kirim-chiqim mavjud emas"
              />
            ) : (
              <MonthlyIncomeExpenseChart
                data={months}
                isLoading={monthlyLoading}
              />
            )}
          </div>
        </Card>
      </div>

      <NotificationsPanel
        open={notifOpen}
        onOpenChange={setNotifOpen}
        warnings={warnings}
        expiringCars={expiringCars}
        isLoading={kpiLoading}
      />

      <ModalWrapper name={MODAL.PAYMENT_CREATE} title="To'lov qo'shish">
        <PaymentCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_CREATE} title="Yangi haydovchi qo'shish">
        <DriverCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_CREATE} title="Yangi mashina qo'shish">
        <CarCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.REST_DAY_CREATE} title="Yangi dam olish kuni">
        <RestDayCreateModal />
      </ModalWrapper>

      <QuickAddFab actions={quickActions} />
    </div>
  );
};

export default DashboardPage;
