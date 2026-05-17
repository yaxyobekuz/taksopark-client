import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useDriverStatementQuery } from "../hooks/useReportsQuery";
import DateRangePicker from "../components/DateRangePicker";

const DriverStatementPage = () => {
  const { driverId } = useParams();
  const { fromDate, toDate, setField } = useObjectState({ fromDate: "", toDate: "" });
  const { data, isLoading } = useDriverStatementQuery(driverId, { fromDate, toDate });

  if (isLoading) return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Ma'lumot yo'q</p>;

  const { driver, payments, fines, damages, cycles } = data;

  return (
    <div className="space-y-4">
      <Link to={`/owner/drivers/${driverId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} className="mr-1" /> Haydovchi sahifasiga
      </Link>

      <h2 className="text-lg font-semibold">
        {driver?.firstName} {driver?.lastName} - hisobot
      </h2>

      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        onChangeFrom={(v) => setField("fromDate", v)}
        onChangeTo={(v) => setField("toDate", v)}
      />

      <div className="space-y-3">
        <h2 className="font-semibold">To'lovlar ({payments.length})</h2>
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Sana</th>
                <th className="text-right p-2">Kutilgan</th>
                <th className="text-right p-2">To'langan</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2">{new Date(p.date).toLocaleDateString("uz-UZ")}</td>
                  <td className="p-2 text-right">{formatMoney(p.expectedPlan)}</td>
                  <td className="p-2 text-right">{formatMoney(p.amount)}</td>
                </tr>
              ))}
              {!payments.length && (
                <tr><td colSpan={3} className="p-3 text-center text-muted-foreground">Yo'q</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Jarimalar ({fines.length})</h2>
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Sana</th>
                <th className="text-right p-2">Summa</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((f) => (
                <tr key={f._id} className="border-t">
                  <td className="p-2">{new Date(f.issueDate).toLocaleDateString("uz-UZ")}</td>
                  <td className="p-2 text-right">{formatMoney(f.amount)}</td>
                </tr>
              ))}
              {!fines.length && (
                <tr><td colSpan={2} className="p-3 text-center text-muted-foreground">Yo'q</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Zararlar ({damages.length})</h2>
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Sana</th>
                <th className="text-right p-2">Summa</th>
              </tr>
            </thead>
            <tbody>
              {damages.map((d) => (
                <tr key={d._id} className="border-t">
                  <td className="p-2">{new Date(d.incidentDate).toLocaleDateString("uz-UZ")}</td>
                  <td className="p-2 text-right">{formatMoney(d.amount)}</td>
                </tr>
              ))}
              {!damages.length && (
                <tr><td colSpan={2} className="p-3 text-center text-muted-foreground">Yo'q</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Tsikllar ({cycles.length})</h2>
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Davr</th>
                <th className="text-right p-2">Yig'ilgan</th>
                <th className="text-right p-2">Oylik</th>
                <th className="text-left p-2">Holat</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.cycleNumber}</td>
                  <td className="p-2">
                    {new Date(c.startDate).toLocaleDateString("uz-UZ")} - {new Date(c.endDate).toLocaleDateString("uz-UZ")}
                  </td>
                  <td className="p-2 text-right">{formatMoney(c.paidTotal)}</td>
                  <td className="p-2 text-right">{c.status === "settled" ? formatMoney(c.finalPayout) : formatMoney(c.salary)}</td>
                  <td className="p-2">{c.status === "open" ? "Ochiq" : "Yakunlangan"}</td>
                </tr>
              ))}
              {!cycles.length && (
                <tr><td colSpan={5} className="p-3 text-center text-muted-foreground">Yo'q</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverStatementPage;
