import { useState } from "react";
import { Plus, Wallet } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import PageHeader from "@/shared/components/ui/layout/PageHeader";
import Button from "@/shared/components/ui/button/Button";
import StatCard from "@/shared/components/ui/card/StatCard";
import InputField from "@/shared/components/ui/input/InputField";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { PaymentDayModal, planStatus } from "@/owner/features/drivers";

import AddPaymentModal from "../components/modals/AddPaymentModal";
import { useDailyPaymentsByDateQuery } from "../hooks/useFinanceQueries";

const driverName = (d) => `${d.firstName} ${d.lastName || ""}`.trim();
const todayStr = () => new Date().toISOString().slice(0, 10);

// Kun uchun to'lov progress bari: to'langan / reja ulushi.
const PaymentProgress = ({ paid, plan }) => {
  const pct = plan > 0 ? Math.min(100, Math.round((paid / plan) * 100)) : 0;
  const barColor = pct >= 100 ? "bg-green-500" : pct > 0 ? "bg-amber-500" : "bg-rose-400";
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-right text-[10px] text-muted-foreground">{pct}%</p>
    </div>
  );
};

const FinancePaymentsPage = () => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);

  const [date, setDate] = useState(todayStr());

  const { data, isLoading } = useDailyPaymentsByDateQuery(date);
  const rows = data?.rows || [];
  const totals = data?.totals || { planTotal: 0, paidTotal: 0, debtTotal: 0 };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kunlik to'lovlar"
        description="Tanlangan kunda to'lov majburiyati bo'lgan haydovchilar"
        actions={
          canManage && (
            <Button onClick={() => openModal(MODAL.PAYMENT_ADD)}>
              <Plus size={16} className="mr-1.5" /> To'lov qo'shish
            </Button>
          )
        }
      />

      <div className="w-44">
        <InputField
          label="Sana"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayStr()}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Kunlik reja" value={totals.planTotal} isMoney />
        <StatCard label="To'langan" value={totals.paidTotal} isMoney />
        <StatCard label="Qarz" value={totals.debtTotal} isMoney />
      </div>

      {isLoading ? (
        <SkeletonCard count={4} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Kunlik plan yo'q"
          description="Bu kunda ish davriga to'g'ri keladigan haydovchi yo'q"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.map((p) => {
            const status = planStatus(p);
            return (
              <div
                key={p._id}
                onClick={() =>
                  openModal(MODAL.PAYMENT_DAY, {
                    plan: p,
                    canManage,
                    driverId: p.driver._id,
                    autoSettleDaily: p.driver.autoSettleDaily !== false,
                    showAutoToggle: true,
                  })
                }
                className="flex flex-col rounded-lg border bg-white p-3 text-left transition-colors hover:border-primary/40 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{driverName(p.driver)}</p>
                    <p className="text-[11px] text-muted-foreground">{formatDateUZ(p.date)}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] px-1.5 py-0.5 rounded ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                {!p.isRestDay && !p.priceMissing && (
                  <>
                    <div className="mt-2 text-xs space-y-0.5">
                      <p className="text-muted-foreground">
                        Reja: <span className="text-foreground">{formatMoney(p.planAmount)}</span>
                      </p>
                      {p.debt > 0 ? (
                        <p className="text-muted-foreground">Qarz: {formatMoney(p.debt)}</p>
                      ) : (
                        <p className="text-muted-foreground">To'langan</p>
                      )}
                    </div>
                    <PaymentProgress paid={p.paidAmount} plan={p.planAmount} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalWrapper name={MODAL.PAYMENT_DAY} title="Kunlik to'lov" className="max-w-md">
        <PaymentDayModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.PAYMENT_ADD} title="To'lov qo'shish" className="max-w-md">
        <AddPaymentModal />
      </ModalWrapper>
    </div>
  );
};

export default FinancePaymentsPage;
