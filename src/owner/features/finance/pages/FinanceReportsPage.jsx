import { useNavigate } from "react-router-dom";

import useObjectState from "@/shared/hooks/useObjectState";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatPhone } from "@/shared/utils/formatPhone";

import MonthSelect from "../components/MonthSelect";
import PaymentsFlowChart from "../components/PaymentsFlowChart";
import { useOverviewQuery } from "../hooks/useFinanceQueries";

const driverName = (d) => `${d.firstName || ""} ${d.lastName || ""}`.trim() || "-";

// P&L: tushum − keshbek chiqim = sof foyda; "Bu oy" va "Jami" ustunlari bilan.
const ProfitRow = ({ label, month, total, strong, sign }) => (
  <div
    className={`grid grid-cols-3 items-center gap-2 px-3 py-2 ${strong ? "font-semibold" : ""}`}
  >
    <span className={strong ? "" : "text-muted-foreground text-sm"}>{label}</span>
    <span className="text-right tabular-nums">
      {sign}
      {formatMoney(month)}
    </span>
    <span className="text-right tabular-nums">
      {sign}
      {formatMoney(total)}
    </span>
  </div>
);

const FinanceReportsPage = () => {
  const navigate = useNavigate();
  const now = new Date();
  const { year, month, setFields } = useObjectState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { data, isLoading } = useOverviewQuery({ year, month });

  const profit = data?.profit || {
    month: { revenue: 0, cashbackExpense: 0, net: 0 },
    total: { revenue: 0, cashbackExpense: 0, net: 0 },
  };
  const debtors = data?.debtors || { total: 0, rows: [] };
  const deposit = data?.deposit || { total: 0 };
  const cashback = data?.cashback || { accrued: 0, paidOut: 0, outstanding: 0 };
  const penalties = data?.penalties || { fronted: 0, repaid: 0, outstanding: 0 };
  const flow = data?.flow || { series: [] };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PageHeader title="Hisobotlar" description="Taksopark moliyaviy manzarasi - uchta hamyon" />
        <MonthSelect year={year} month={month} onChange={setFields} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <SkeletonStatCard count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Hisobotlar" description="Taksopark moliyaviy manzarasi - uchta hamyon" />
      <MonthSelect year={year} month={month} onChange={setFields} />

      {/* ─── 1-HAMYON: ASOSIY (P&L) - Sof foyda ─── */}
      <Card className="rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-900">Asosiy hamyon - Sof foyda</h2>
          <span className="text-xs text-muted-foreground">Taksoparkning haqiqiy biznesi</span>
        </div>
        <div className="grid grid-cols-3 gap-2 px-3 pb-1 text-xs font-medium uppercase text-muted-foreground">
          <span />
          <span className="text-right">Bu oy</span>
          <span className="text-right">Jami</span>
        </div>
        <div className="rounded-lg border divide-y">
          <ProfitRow
            label="Tushum (kunlik to'lov)"
            month={profit.month.revenue}
            total={profit.total.revenue}
            sign="+"
          />
          <ProfitRow
            label="Keshbek chiqim"
            month={profit.month.cashbackExpense}
            total={profit.total.cashbackExpense}
            sign="−"
          />
          <div className="bg-muted/40">
            <ProfitRow
              label="Sof foyda"
              month={profit.month.net}
              total={profit.total.net}
              strong
            />
          </div>
        </div>
      </Card>

      {/* ─── Hamyonlar qoldig'i: qarz, keshbek, depozit ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          label="Haydovchilar ijara qarzi"
          hint={debtors.rows.length ? `${debtors.rows.length} ta haydovchi` : "Qarzdor yo'q"}
          value={debtors.total}
          tone={debtors.total > 0 ? "negative" : "positive"}
          isMoney
        />
        <StatCard
          label="Keshbek qoldig'i (berishim kerak)"
          hint={`Berilgan: ${formatMoney(cashback.paidOut)} · Hisoblangan: ${formatMoney(cashback.accrued)}`}
          value={cashback.outstanding}
          tone="info"
          isMoney
        />
        <StatCard
          label="Depozit hamyoni (garov)"
          hint="Haydovchilar puli - taksoparkka tegishli emas"
          value={deposit.total}
          isMoney
        />
      </div>

      {/* ─── Q3: Qarzdorlar ro'yxati ─── */}
      <Card className="rounded-lg" title="Qarzdor haydovchilar">
        {debtors.rows.length === 0 ? (
          <div className="pt-2">
            <EmptyState title="Qarzdor yo'q" description="Hozircha to'lanmagan ijara qarzi yo'q" />
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-3 font-medium">Haydovchi</th>
                  <th className="p-3 font-medium">Telefon</th>
                  <th className="p-3 font-medium text-right">Ijara qarzi</th>
                </tr>
              </thead>
              <tbody>
                {debtors.rows.map((r) => (
                  <tr
                    key={r.driver._id}
                    onClick={() => navigate(`/owner/drivers/${r.driver._id}`)}
                    className="border-t cursor-pointer hover:bg-muted/50"
                  >
                    <td className="p-3 font-medium">{driverName(r.driver)}</td>
                    <td className="p-3 text-muted-foreground">
                      {r.driver.phone ? formatPhone(r.driver.phone) : "-"}
                    </td>
                    <td className="p-3 text-right tabular-nums text-rose-600">
                      {formatMoney(r.debt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ─── 3-HAMYON: Jarima/Zarar (P&L'dan ajratilgan) ─── */}
      <Card className="rounded-lg border-amber-200 bg-amber-50/40">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Jarima / Zarar hamyoni</h2>
          <span className="text-xs text-amber-700">Sof foydaga kirmaydi</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label="Taksopark qoplagan"
            hint="Jarima + zarar jami"
            value={penalties.fronted}
            isMoney
          />
          <StatCard
            label="Haydovchidan qaytarilgan"
            value={penalties.repaid}
            tone="positive"
            isMoney
          />
          <StatCard
            label="Qoldiq (haydovchi qarzi)"
            value={penalties.outstanding}
            tone={penalties.outstanding > 0 ? "warn" : "default"}
            isMoney
          />
        </div>
      </Card>

      {/* ─── Oylik kunlik to'lov oqimi ─── */}
      <Card className="rounded-lg" title="Kunlik to'lov oqimi (bu oy)">
        <div className="mt-3">
          <PaymentsFlowChart series={flow.series} />
        </div>
      </Card>
    </div>
  );
};

export default FinanceReportsPage;
