import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, Trash2, CalendarRange, Wallet, RotateCcw } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import StatCard from "@/shared/components/ui/card/StatCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";

import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { TARIFF, TARIFF_LABELS, TARIFF_BADGE_CLASS } from "@/shared/constants/tariffs";
import { formatDateUZ } from "@/shared/utils/date.utils";

import { useWorkPeriodsQuery } from "../hooks/useWorkPeriodsQuery";
import {
  totalDaysByTariff,
  formatDuration,
  periodState,
  periodDays,
} from "../utils/workPeriod.utils";
import WorkPeriodFormModal from "../components/modals/WorkPeriodFormModal";
import WorkPeriodDeleteModal from "../components/modals/WorkPeriodDeleteModal";

const STATE_BADGE = {
  active: { label: "Joriy", className: "bg-green-50 text-green-700" },
  past: { label: "Yakunlangan", className: "bg-gray-100 text-gray-600" },
  future: { label: "Rejalashtirilgan", className: "bg-amber-50 text-amber-700" },
};

const DriverWorkPeriodsPage = () => {
  const { driver } = useOutletContext();
  const driverId = driver._id;
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.WORK_PERIODS_MANAGE);

  const { data: periods = [], isLoading } = useWorkPeriodsQuery(driverId);
  const totals = totalDaysByTariff(periods);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Jami ish muddati"
          value={totals.total}
          suffix=" kun"
          hint={formatDuration(totals.total)}
          icon={CalendarRange}
          tone="info"
        />
        <StatCard
          label="Depozitli tarifda"
          value={totals[TARIFF.DEPOSIT]}
          suffix=" kun"
          hint={formatDuration(totals[TARIFF.DEPOSIT])}
          icon={Wallet}
        />
        <StatCard
          label="Keshbekli tarifda"
          value={totals[TARIFF.CASHBACK]}
          suffix=" kun"
          hint={formatDuration(totals[TARIFF.CASHBACK])}
          icon={RotateCcw}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Ish davrlari</h2>
        {canManage && (
          <Button size="sm" onClick={() => openModal(MODAL.WORK_PERIOD_FORM, { driverId })}>
            <Plus size={16} className="mr-1.5" /> Yangi davr
          </Button>
        )}
      </div>

      {isLoading ? (
        <SkeletonCard count={3} />
      ) : periods.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Ish davri yo'q"
          description="Haydovchining birinchi ish davrini qo'shing - ish boshlash sanasi shundan olinadi"
          action={
            canManage ? (
              <Button onClick={() => openModal(MODAL.WORK_PERIOD_FORM, { driverId })}>
                <Plus size={16} className="mr-1.5" /> Yangi davr
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-2">
          {periods.map((p) => {
            const state = STATE_BADGE[periodState(p)] || STATE_BADGE.past;
            return (
              <div
                key={p._id}
                className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        TARIFF_BADGE_CLASS[p.tariff] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {TARIFF_LABELS[p.tariff] || p.tariff}
                    </span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded ${state.className}`}>
                      {state.label}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDateUZ(p.startDate)} -{" "}
                    {p.endDate ? formatDateUZ(p.endDate) : "hozirgacha"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(periodDays(p))}
                    {p.note ? ` · ${p.note}` : ""}
                  </p>
                </div>

                {canManage && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.WORK_PERIOD_FORM, { driverId, period: p })}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                      title="Tahrirlash"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.WORK_PERIOD_DELETE, { driverId, period: p })}
                      className="p-1.5 text-muted-foreground hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalWrapper name={MODAL.WORK_PERIOD_FORM} title="Ish davri" className="max-w-md">
        <WorkPeriodFormModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.WORK_PERIOD_DELETE} title="O'chirishni tasdiqlash" className="max-w-md">
        <WorkPeriodDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverWorkPeriodsPage;
