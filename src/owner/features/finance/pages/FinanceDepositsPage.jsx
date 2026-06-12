import PageHeader from "@/shared/components/ui/layout/PageHeader";
import Button from "@/shared/components/ui/button/Button";
import StatCard from "@/shared/components/ui/card/StatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";

import { useDepositsQuery } from "../hooks/useFinanceQueries";
import DepositDriverModal from "../components/modals/DepositDriverModal";

const driverName = (d) => `${d.firstName} ${d.lastName || ""}`.trim();

const FinanceDepositsPage = () => {
  const { openModal } = useModal();
  const { data, isLoading } = useDepositsQuery();
  const rows = data?.rows || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Depozitlar" description="Depozitli tarif haydovchilari bo'yicha depozit balanslari" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Jami depozit balansi" value={total} isMoney />
      </div>

      {isLoading ? (
        <SkeletonCard count={4} />
      ) : rows.length === 0 ? (
        <EmptyState title="Depozit haydovchisi yo'q" description="Depozitli tarifdagi haydovchilar shu yerda ko'rinadi" />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="p-3 font-medium">Haydovchi</th>
                <th className="p-3 font-medium text-right">Balans</th>
                <th className="p-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.driver._id}
                  onClick={() => openModal(MODAL.DEPOSIT_DRIVER, { driver: r.driver })}
                  className="border-t cursor-pointer hover:bg-muted/50"
                >
                  <td className="p-3 font-medium">{driverName(r.driver)}</td>
                  <td className="p-3 text-right tabular-nums">{formatMoney(r.balance)}</td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal(MODAL.DEPOSIT_DRIVER, { driver: r.driver })}
                    >
                      Ochish
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalWrapper name={MODAL.DEPOSIT_DRIVER} title="Depozit" className="max-w-lg">
        <DepositDriverModal />
      </ModalWrapper>
    </div>
  );
};

export default FinanceDepositsPage;
