import { useParams, Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { TARIFF_LABELS } from "@/shared/constants/tariffs";
import { useDriverQuery, useDriverBalanceQuery } from "../hooks/useDriversQuery";
import { useDriverRecompute } from "../hooks/useDriverMutations";
import DriverBalancePanel from "../components/DriverBalancePanel";

const DriverDetailPage = () => {
  const { id } = useParams();
  const { data: driver, isLoading } = useDriverQuery(id);
  const { data: balance, isLoading: balanceLoading } = useDriverBalanceQuery(id);
  const { mutate: recompute, isPending: recomputing } = useDriverRecompute();
  const { has } = usePermissions();

  if (isLoading) return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  if (!driver) return <p className="text-sm text-muted-foreground">Haydovchi topilmadi</p>;

  return (
    <div className="space-y-4">
      <Link to="/owner/drivers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} className="mr-1" /> Haydovchilar
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {driver.firstName} {driver.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {driver.phone} · {TARIFF_LABELS[driver.tariff]} · {driver.car?.plateNumber || "Mashina biriktirilmagan"}
          </p>
        </div>
        {has(PERMISSIONS.DRIVERS_UPDATE) && (
          <Button variant="outline" onClick={() => recompute(id)} disabled={recomputing}>
            <RefreshCw size={14} className="mr-2" />
            Balansni qayta hisoblash
          </Button>
        )}
      </div>

      <DriverBalancePanel balance={balance} isLoading={balanceLoading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 bg-white space-y-2">
          <h3 className="font-semibold">Umumiy ma'lumot</h3>
          <p className="text-sm"><span className="text-muted-foreground">Ish boshlagan:</span> {new Date(driver.startDate).toLocaleDateString("uz-UZ")}</p>
          {driver.notes && (
            <p className="text-sm whitespace-pre-wrap"><span className="text-muted-foreground">Izoh:</span> {driver.notes}</p>
          )}
        </div>

        <div className="rounded-lg border p-4 bg-white space-y-2">
          <h3 className="font-semibold">Mashina</h3>
          {driver.car ? (
            <>
              <p className="text-sm"><span className="text-muted-foreground">Raqami:</span> {driver.car.plateNumber || "-"}</p>
              <p className="text-sm"><span className="text-muted-foreground">Model:</span> {driver.car.model}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Mashina biriktirilmagan</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 text-sm">
        <Link to={`/owner/payments?driverId=${driver._id}`} className="text-primary hover:underline">
          To'lovlar
        </Link>
        <Link to={`/owner/fines?driverId=${driver._id}`} className="text-primary hover:underline">
          Jarimalar
        </Link>
        <Link to={`/owner/damages?driverId=${driver._id}`} className="text-primary hover:underline">
          Zararlar
        </Link>
        <Link to={`/owner/cycles?driverId=${driver._id}`} className="text-primary hover:underline">
          Tsikllar
        </Link>
        <Link to={`/owner/payments/reports/statement/${driver._id}`} className="text-primary hover:underline">
          Hisobot
        </Link>
      </div>
    </div>
  );
};

export default DriverDetailPage;
