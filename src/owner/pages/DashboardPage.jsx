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
} from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";
import Card from "@/shared/components/ui/card/Card";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
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
        {/* Title */}
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
            className="border-l-4 border-l-amber-400 space-y-3"
          >
            <div className="space-y-3 mt-3">
              {depositEmpty.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Depoziti tugagan ({depositEmpty.length})
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {depositEmpty.map((d) => (
                      <Link
                        key={d._id}
                        to={`/owner/drivers/${d._id}`}
                        className="flex flex-wrap items-center gap-2 hover:text-primary"
                      >
                        <span>
                          {d.firstName} {d.lastName}
                        </span>
                        {d.car?.plateNumber ? (
                          <PlateNumber value={d.car.plateNumber} size="sm" />
                        ) : (
                          <span>-</span>
                        )}
                        <span>({formatMoney(d.depositRemaining)})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {depositLow.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Depoziti 500 000 dan kam ({depositLow.length})
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {depositLow.map((d) => (
                      <Link
                        key={d._id}
                        to={`/owner/drivers/${d._id}`}
                        className="flex flex-wrap items-center gap-2 hover:text-primary"
                      >
                        <span>
                          {d.firstName} {d.lastName}
                        </span>
                        {d.car?.plateNumber ? (
                          <PlateNumber value={d.car.plateNumber} size="sm" />
                        ) : (
                          <span>-</span>
                        )}
                        <span>({formatMoney(d.depositRemaining)})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {noPayment.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    2 kundan ortiq to'lov yo'q ({noPayment.length})
                  </p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {noPayment.map((w) => (
                      <Link
                        key={w.driver._id}
                        to={`/owner/drivers/${w.driver._id}`}
                        className="flex flex-wrap items-center gap-2 hover:text-primary"
                      >
                        <span>
                          {w.driver.firstName} {w.driver.lastName}
                        </span>
                        {w.driver.car?.plateNumber ? (
                          <PlateNumber
                            value={w.driver.car.plateNumber}
                            size="sm"
                          />
                        ) : (
                          <span>-</span>
                        )}
                        <span>({w.daysSince} kun)</span>
                      </Link>
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
            <div className="text-sm space-y-1 mt-3">
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
                    className="flex flex-wrap items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <span className="font-medium text-foreground">
                      {car.model}
                    </span>
                    {car.plateNumber ? (
                      <PlateNumber value={car.plateNumber} size="sm" />
                    ) : (
                      <span>-</span>
                    )}
                    <span>
                      {label}: {formatDateUZ(expiring.expiryDate)}
                    </span>
                    <span
                      className={
                        expired ? "text-red-600 font-medium" : "text-amber-700"
                      }
                    >
                      ({expired ? `${-days} kun o'tgan` : `${days} kun qoldi`})
                    </span>
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
