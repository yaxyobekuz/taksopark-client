import { Link } from "react-router-dom";
import { Wallet, Users, AlertTriangle, ArrowDownCircle, ArrowUpCircle, CalendarClock } from "lucide-react";
import StatCard from "@/shared/components/ui/card/StatCard";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { usePaymentTodayTotalQuery } from "@/owner/features/payments";
import { useDriversQuery, useDriverWarningsQuery } from "@/owner/features/drivers";
import { useTransactionsSummaryQuery } from "@/owner/features/transactions";
import { useCarsExpiringQuery } from "@/owner/features/cars";
import { getDaysLeft } from "@/owner/features/cars/utils/expiryStatus";

const today = new Date().toISOString().slice(0, 10);

const DashboardPage = () => {
  const { data: todayTotal } = usePaymentTodayTotalQuery(today);
  const { data: activeDriversData } = useDriversQuery({ status: "active", limit: 1 });
  const { data: warnings } = useDriverWarningsQuery();
  const { data: todaySummary } = useTransactionsSummaryQuery({ fromDate: today, toDate: today });
  const { data: expiringCars = [] } = useCarsExpiringQuery({ limit: 5, days: 30 });

  const activeCount = activeDriversData?.meta?.total ?? 0;

  const depositLow = warnings?.depositLow || [];
  const depositEmpty = warnings?.depositEmpty || [];
  const noPayment = warnings?.noPayment2Days || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Boshqaruv paneli</h1>
        <p className="text-sm text-muted-foreground">Bugun: {new Date().toLocaleDateString("uz-UZ")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard
          label="Bugungi to'plangan"
          value={todayTotal?.totalAmount || 0}
          isMoney
          tone="positive"
          icon={Wallet}
        />
        <StatCard
          label="Bugungi kutilgan reja"
          value={todayTotal?.totalExpected || 0}
          isMoney
          tone="info"
          icon={Wallet}
        />
        <StatCard label="Faol haydovchilar" value={activeCount} tone="default" icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

      {(depositLow.length > 0 || depositEmpty.length > 0 || noPayment.length > 0) && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <AlertTriangle size={18} />
            Diqqat talab qiluvchi haydovchilar
          </div>

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
                    className="block hover:text-primary"
                  >
                    {d.firstName} {d.lastName} - {d.car?.plateNumber || "-"} ({formatMoney(d.depositRemaining)})
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
                    className="block hover:text-primary"
                  >
                    {d.firstName} {d.lastName} - {d.car?.plateNumber || "-"} ({formatMoney(d.depositRemaining)})
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
                    className="block hover:text-primary"
                  >
                    {w.driver.firstName} {w.driver.lastName} - {w.driver.car?.plateNumber || "-"} ({w.daysSince} kun)
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {expiringCars.length > 0 && (
        <div className="rounded-lg border-l-4 border-red-400 bg-red-50 p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-red-800">
            <CalendarClock size={18} />
            Muddati tugayotgan mashinalar
          </div>
          <div className="text-sm space-y-1">
            {expiringCars.map((car) => {
              const candidates = [
                car.licenseExpiryDate && { label: "Litsenziya", date: car.licenseExpiryDate },
                car.powerOfAttorneyExpiryDate && { label: "Dovernost", date: car.powerOfAttorneyExpiryDate },
              ].filter(Boolean);
              const soonest = candidates.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
              const days = getDaysLeft(soonest.date);
              const expired = days < 0;
              return (
                <Link
                  key={car._id}
                  to={`/owner/cars/${car._id}`}
                  className="block text-muted-foreground hover:text-primary"
                >
                  <span className="font-medium text-foreground">{car.model}</span>
                  {" - "}
                  {car.plateNumber || "-"}
                  {" - "}
                  {soonest.label}: {formatDateUZ(soonest.date)}{" "}
                  <span className={expired ? "text-red-600 font-medium" : "text-amber-700"}>
                    ({expired ? `${-days} kun o'tgan` : `${days} kun qoldi`})
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
