import PageHeader from "@/shared/components/ui/layout/PageHeader";
import StatCard from "@/shared/components/ui/card/StatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";

import { useCashbacksQuery } from "../hooks/useFinanceQueries";
import CashbackDriverModal from "../components/modals/CashbackDriverModal";

const driverName = (d) => `${d.firstName} ${d.lastName || ""}`.trim();

const FinanceCashbacksPage = () => {
  const { openModal } = useModal();
  const { data, isLoading } = useCashbacksQuery();
  const rows = data?.rows || [];
  const totals = data?.totals || { accrued: 0, paidOut: 0, available: 0 };

  return (
    <div className="space-y-4">
      <PageHeader title="Keshbeklar" description="Keshbekli tarif haydovchilari bo'yicha keshbek holati" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Jami hisoblangan" value={totals.accrued} isMoney />
        <StatCard label="To'langan" value={totals.paidOut} isMoney />
        <StatCard label="Qoldiq" value={totals.available} isMoney />
      </div>

      {isLoading ? (
        <SkeletonCard count={4} />
      ) : rows.length === 0 ? (
        <EmptyState title="Keshbek haydovchisi yo'q" description="Keshbekli tarifdagi haydovchilar shu yerda ko'rinadi" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Haydovchi</th>
                <th className="p-3 font-medium text-right">Hisoblangan</th>
                <th className="p-3 font-medium text-right">To'langan</th>
                <th className="p-3 font-medium text-right">Qoldiq</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.driver._id}
                  onClick={() => openModal(MODAL.CASHBACK_DRIVER, { driver: r.driver })}
                  className="border-t cursor-pointer hover:bg-muted/50"
                >
                  <td className="p-3 font-medium">{driverName(r.driver)}</td>
                  <td className="p-3 text-right tabular-nums">{formatMoney(r.accrued)}</td>
                  <td className="p-3 text-right tabular-nums">{formatMoney(r.paidOut)}</td>
                  <td className="p-3 text-right tabular-nums">{formatMoney(r.available)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalWrapper name={MODAL.CASHBACK_DRIVER} title="Keshbek" className="max-w-lg">
        <CashbackDriverModal />
      </ModalWrapper>
    </div>
  );
};

export default FinanceCashbacksPage;
