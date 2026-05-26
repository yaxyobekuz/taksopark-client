import { Link } from "react-router-dom";
import {
  Wallet,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarClock,
  BarChart3,
  LineChart as LineChartIcon,
  Scale,
  Car as CarIcon,
} from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";
import Card from "@/shared/components/ui/card/Card";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import {
  useMonthlyIncomeExpenseQuery,
  useDailyIncomeExpenseQuery,
  MonthlyIncomeExpenseChart,
  DailyIncomeExpenseChart,
} from "@/owner/features/payments";
import { useDriverWarningsQuery } from "@/owner/features/drivers";
import { useTransactionsSummaryQuery } from "@/owner/features/transactions";
import { useCarsExpiringQuery } from "@/owner/features/cars";
import { getDaysLeft } from "@/owner/features/cars/utils/expiryStatus";

const today = new Date().toISOString().slice(0, 10);

const initialsOf = (first = "", last = "") =>
  `${(first[0] || "").toUpperCase()}${(last[0] || "").toUpperCase()}` || "?";

const DriverAvatar = ({ driver, size = 36 }) => {
  const src = buildFileUrl(driver?.photoUrl);
  const cls = "rounded-full object-cover border shrink-0 bg-white";
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className={cls}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0 border"
    >
      {initialsOf(driver?.firstName, driver?.lastName)}
    </div>
  );
};

const CarAvatar = ({ car, size = 28 }) => {
  const src = buildFileUrl(car?.photoUrl);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="rounded-md object-cover border shrink-0 bg-white"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0 border"
    >
      <CarIcon size={Math.round(size * 0.55)} />
    </div>
  );
};

const CarTooltipContent = ({ car }) => (
  <div className="flex items-center gap-2 max-w-[260px]">
    <CarAvatar car={car} size={40} />
    <div className="flex flex-col gap-1 min-w-0">
      <span className="font-medium truncate">{car?.model || "Mashina"}</span>
      {car?.plateNumber && <PlateNumber value={car.plateNumber} size="sm" />}
    </div>
  </div>
);

// Asosiy haydovchi item: chap - avatar+ism (driverga link), o'ng - meta + car (carga link).
const DriverWarningItem = ({ driver, meta, accentClassName = "" }) => {
  const hasCar = !!driver?.car;
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-2 rounded-md hover:bg-muted/60 transition-colors">
      <Link
        to={`/owner/drivers/${driver._id}`}
        className="flex items-center gap-2.5 min-w-0 group"
      >
        <DriverAvatar driver={driver} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate group-hover:text-primary">
            {driver.firstName} {driver.lastName}
          </span>
          {driver.phone && (
            <span className="text-xs text-muted-foreground truncate">
              {driver.phone}
            </span>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-3 shrink-0">
        {meta && (
          <span className={`text-xs font-medium ${accentClassName}`}>
            {meta}
          </span>
        )}
        {hasCar ? (
          <Tooltip content={<CarTooltipContent car={driver.car} />}>
            <Link
              to={`/owner/cars/${driver.car._id}`}
              className="shrink-0"
              aria-label={driver.car.model || "Mashina"}
            >
              <CarAvatar car={driver.car} />
            </Link>
          </Tooltip>
        ) : (
          <span className="text-xs text-muted-foreground">Mashinasiz</span>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { data: warnings } = useDriverWarningsQuery();
  const { data: todaySummary } = useTransactionsSummaryQuery({
    fromDate: today,
    toDate: today,
  });
  const { data: expiringCars = [] } = useCarsExpiringQuery({
    limit: 5,
    days: 30,
  });
  const { data: monthly, isLoading: monthlyLoading } =
    useMonthlyIncomeExpenseQuery();
  const { data: daily, isLoading: dailyLoading } =
    useDailyIncomeExpenseQuery(30);

  const months = monthly?.months || [];
  const thisMonth = months[months.length - 1] || {
    income: 0,
    expense: 0,
    profit: 0,
  };

  const depositLow = warnings?.depositLow || [];
  const depositEmpty = warnings?.depositEmpty || [];
  const noPayment = warnings?.noPayment2Days || [];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Xush kelibsiz, hurmatli foydalanuvchi! 🫡
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Bugungi kirim"
            value={todaySummary?.income || 0}
            isMoney
            tone="positive"
            icon={ArrowDownCircle}
          />
          <StatCard
            label="Bugungi chiqim"
            value={todaySummary?.expense || 0}
            isMoney
            tone="warn"
            icon={ArrowUpCircle}
          />
          <StatCard
            label="Bugungi balans"
            value={todaySummary?.balance || 0}
            isMoney
            tone={(todaySummary?.balance || 0) >= 0 ? "positive" : "warn"}
            icon={Wallet}
          />
        </div>

        <Card
          title="So'nggi 30 kun - Kirim/Chiqim"
          icon={<LineChartIcon size={20} className="text-primary" />}
        >
          <div className="mt-3">
            <DailyIncomeExpenseChart
              data={daily?.items || []}
              isLoading={dailyLoading}
            />
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {(depositLow.length > 0 ||
          depositEmpty.length > 0 ||
          noPayment.length > 0) && (
          <Card
            title="Diqqat talab qiluvchi haydovchilar"
            icon={<AlertTriangle size={20} className="text-amber-600" />}
            className="border-l-4 border-l-amber-400"
          >
            <div className="mt-3 divide-y">
              {depositEmpty.length > 0 && (
                <div className="pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-1">
                    Depoziti tugagan ({depositEmpty.length})
                  </p>
                  <div className="divide-y">
                    {depositEmpty.map((d) => (
                      <DriverWarningItem
                        key={d._id}
                        driver={d}
                        meta={formatMoney(d.depositRemaining)}
                        accentClassName="text-red-600"
                      />
                    ))}
                  </div>
                </div>
              )}

              {depositLow.length > 0 && (
                <div className="py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
                    Depoziti 500 000 dan kam ({depositLow.length})
                  </p>
                  <div className="divide-y">
                    {depositLow.map((d) => (
                      <DriverWarningItem
                        key={d._id}
                        driver={d}
                        meta={formatMoney(d.depositRemaining)}
                        accentClassName="text-amber-700"
                      />
                    ))}
                  </div>
                </div>
              )}

              {noPayment.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-700 mb-1">
                    2 kundan ortiq to'lov yo'q ({noPayment.length})
                  </p>
                  <div className="divide-y">
                    {noPayment.map((w) => (
                      <DriverWarningItem
                        key={w.driver._id}
                        driver={w.driver}
                        meta={`${w.daysSince} kun`}
                        accentClassName="text-orange-700"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {expiringCars.length > 0 && (
          <Card
            title="Muddati tugayotgan mashinalar"
            icon={<CalendarClock size={20} className="text-red-600" />}
            className="border-l-4 border-l-red-400"
          >
            <div className="mt-3 divide-y">
              {expiringCars.map((car) => {
                const expiring = car.expiringDocument;
                if (!expiring?.expiryDate) return null;
                const days = getDaysLeft(expiring.expiryDate);
                const expired = days < 0;
                const label = expiring.documentType?.name || "Hujjat";
                return (
                  <Link
                    key={car._id}
                    to={`/owner/cars/${car._id}`}
                    className="flex items-center justify-between gap-3 py-2 px-2 rounded-md hover:bg-muted/60 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CarAvatar car={car} size={36} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                          {car.model}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {label}: {formatDateUZ(expiring.expiryDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs font-medium ${
                          expired ? "text-red-600" : "text-amber-700"
                        }`}
                      >
                        {expired
                          ? `${-days} kun o'tgan`
                          : `${days} kun qoldi`}
                      </span>
                      {car.plateNumber && (
                        <PlateNumber value={car.plateNumber} size="sm" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Bu oy kirim"
            value={thisMonth.income}
            isMoney
            icon={ArrowDownCircle}
          />
          <StatCard
            label="Bu oy chiqim"
            value={thisMonth.expense}
            isMoney
            icon={ArrowUpCircle}
          />
          <StatCard
            label="Bu oy sof foyda"
            value={thisMonth.profit}
            isMoney
            tone={thisMonth.profit >= 0 ? "positive" : "negative"}
            icon={Scale}
          />
        </div>

        <Card
          title="So'nggi 12 oy - Kirim/Chiqim"
          icon={<BarChart3 className="text-primary" />}
        >
          <div className="mt-3">
            <MonthlyIncomeExpenseChart
              data={months}
              isLoading={monthlyLoading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
