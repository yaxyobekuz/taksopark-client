import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import PageHeader from "@/shared/components/ui/layout/PageHeader";
import StatCard from "@/shared/components/ui/card/StatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { PaymentDayModal, planStatus } from "@/owner/features/drivers";

import MonthSelect from "../components/MonthSelect";
import { useDailyPaymentsQuery } from "../hooks/useFinanceQueries";

const driverName = (d) => `${d.firstName} ${d.lastName || ""}`.trim();

const FinancePaymentsPage = () => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const now = new Date();
  const { year, month, setFields } = useObjectState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { data, isLoading } = useDailyPaymentsQuery({ year, month });
  const rows = data?.rows || [];
  const totals = data?.totals || { planTotal: 0, paidTotal: 0, debtTotal: 0 };

  return (
    <div className="space-y-4">
      <PageHeader title="Kunlik to'lovlar" description="Tanlangan oy bo'yicha haydovchilarning kunlik to'lov planlari" />
      <MonthSelect year={year} month={month} onChange={setFields} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Oylik reja" value={totals.planTotal} isMoney />
        <StatCard label="To'langan" value={totals.paidTotal} isMoney />
        <StatCard label="Qarz" value={totals.debtTotal} isMoney />
      </div>

      {isLoading ? (
        <SkeletonCard count={4} />
      ) : rows.length === 0 ? (
        <EmptyState title="Kunlik plan yo'q" description="Bu oyda ish davriga to'g'ri keladigan kun yo'q" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Sana</th>
                <th className="p-3 font-medium">Haydovchi</th>
                <th className="p-3 font-medium text-right">Reja</th>
                <th className="p-3 font-medium text-right">To'langan</th>
                <th className="p-3 font-medium text-right">Qarz</th>
                <th className="p-3 font-medium">Holat</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const status = planStatus(p);
                return (
                  <tr
                    key={p._id}
                    onClick={() => openModal(MODAL.PAYMENT_DAY, { plan: p, canManage })}
                    className="border-t cursor-pointer hover:bg-muted/50"
                  >
                    <td className="p-3 whitespace-nowrap">{formatDateUZ(p.date)}</td>
                    <td className="p-3 font-medium">{driverName(p.driver)}</td>
                    <td className="p-3 text-right tabular-nums">{formatMoney(p.planAmount)}</td>
                    <td className="p-3 text-right tabular-nums">{formatMoney(p.paidAmount)}</td>
                    <td className="p-3 text-right tabular-nums">{formatMoney(p.debt)}</td>
                    <td className="p-3">
                      <span className={`text-[11px] px-1.5 py-0.5 rounded ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ModalWrapper name={MODAL.PAYMENT_DAY} title="Kunlik to'lov" className="max-w-md">
        <PaymentDayModal />
      </ModalWrapper>
    </div>
  );
};

export default FinancePaymentsPage;
