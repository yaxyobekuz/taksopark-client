import { useQueryClient } from "@tanstack/react-query";
import { Wallet, CheckCircle2, AlertCircle, CalendarOff, CalendarCheck } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import SelectField from "@/shared/components/ui/select/SelectField";
import Switch from "@/shared/components/ui/switch/Switch";
import StatCard from "@/shared/components/ui/card/StatCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";

import { qk } from "@/shared/lib/query/keys";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { months as MONTHS } from "@/shared/utils/date.utils";
import { formatMoney } from "@/shared/utils/formatMoney";

import { usePaymentsMonthQuery } from "../hooks/usePaymentsQuery";
import { useDriverAutoSettleToggle } from "../hooks/useDriverMutations";
import {
  useRestdayCreate,
  useRestdayDelete,
} from "@/owner/features/restdays/hooks/useRestdayMutations";
import PaymentDayModal from "./modals/PaymentDayModal";
import { planStatus } from "../utils/payment.utils";

const WEEKDAYS_UZ = ["yak", "dush", "sesh", "chor", "pay", "jum", "shan"];

const startYear = (driver) =>
  driver?.firstWorkDate ? new Date(driver.firstWorkDate).getFullYear() : new Date().getFullYear();

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

// Bitta haydovchining tanlangan oy bo'yicha kunlik to'lovlari (kartochkalar + to'r + modal).
// Ham haydovchi detail tabida, ham Moliya bo'limida ishlatiladi.
const PaymentsMonthView = ({ driverId, driver }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();
  const qc = useQueryClient();
  const canManage = has(PERMISSIONS.PAYMENTS_MANAGE);
  const canRest = has(PERMISSIONS.REST_DAYS_MANAGE);

  const now = new Date();
  const { year, month, setField } = useObjectState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  const { data, isLoading } = usePaymentsMonthQuery({ driverId, year, month });
  const plans = data?.plans || [];
  const summary = data?.summary || { planTotal: 0, paidTotal: 0, debtTotal: 0 };

  const restCreate = useRestdayCreate();
  const restDelete = useRestdayDelete();
  const togglePending = restCreate.isPending || restDelete.isPending;

  const autoToggle = useDriverAutoSettleToggle();
  const autoSettleDaily = driver?.autoSettleDaily !== false;

  // Dam olish kuni o'zgarsa kunlik planlar qayta hisoblanadi - to'lov ko'rinishini ham yangilaymiz.
  const refreshPayments = () => {
    qc.invalidateQueries({ queryKey: qk.payments.all() });
    qc.invalidateQueries({ queryKey: qk.finance.all() });
  };

  const toggleRestDay = (plan) => {
    if (togglePending) return;
    if (plan.isRestDay) {
      if (!plan.restDay) return;
      restDelete.mutate(plan.restDay, { onSuccess: refreshPayments });
    } else {
      restCreate.mutate({ driverId, date: plan.dateKey }, { onSuccess: refreshPayments });
    }
  };

  const yearOptions = [];
  for (let y = startYear(driver); y <= now.getFullYear(); y += 1) {
    yearOptions.push({ value: String(y), label: String(y) });
  }
  const monthOptions = MONTHS.map((m) => ({ value: String(m.value + 1), label: m.label }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Oylik reja" value={summary.planTotal} isMoney icon={Wallet} />
        <StatCard label="To'langan" value={summary.paidTotal} isMoney icon={CheckCircle2} />
        <StatCard label="Qarz" value={summary.debtTotal} isMoney icon={AlertCircle} />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-32">
          <SelectField
            label="Yil"
            value={String(year)}
            onChange={(v) => setField("year", Number(v))}
            options={yearOptions}
          />
        </div>
        <div className="w-40">
          <SelectField
            label="Oy"
            value={String(month)}
            onChange={(v) => setField("month", Number(v))}
            options={monthOptions}
          />
        </div>

        {canManage && (
          <div className="ml-auto flex items-start gap-3 rounded-lg border bg-white p-2.5">
            <div className="text-xs">
              <p className="font-medium">Avtomatik qoplash</p>
              <p className="text-muted-foreground max-w-[15rem]">
                {autoSettleDaily
                  ? "Kunlik qarz depozit/keshbekdan avtomatik qoplanadi"
                  : "O'chirilgan - kunlardagi auto-qoplashni bekor qilib davrlarni tahrirlash mumkin"}
              </p>
            </div>
            <Switch
              checked={autoSettleDaily}
              disabled={autoToggle.isPending}
              onChange={(enabled) => autoToggle.mutate({ id: driverId, enabled })}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <SkeletonCard count={3} />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Kunlik plan yo'q"
          description="Bu oyda haydovchining ish davriga to'g'ri keladigan kun yo'q"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {plans.map((p) => {
            const status = planStatus(p);
            const dayUTC = new Date(`${p.dateKey}T00:00:00Z`);
            const paidDay = (p.paidAmount || 0) > 0;
            // To'lov qilingan kunni dam olish deb belgilab bo'lmaydi (biznes qoidasi).
            const markDisabled = togglePending || (!p.isRestDay && paidDay);
            return (
              <div
                key={p._id}
                onClick={() => openModal(MODAL.PAYMENT_DAY, { plan: p, canManage, autoSettleDaily })}
                className="flex flex-col rounded-lg border bg-white p-3 text-left transition-colors hover:border-primary/40 cursor-pointer"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-semibold">{dayUTC.getUTCDate()}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {WEEKDAYS_UZ[dayUTC.getUTCDay()]}
                  </span>
                </div>
                <span className={`mt-1 inline-block w-max text-[11px] px-1.5 py-0.5 rounded ${status.className}`}>
                  {status.label}
                </span>

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

                {canRest && (
                  <button
                    type="button"
                    disabled={markDisabled}
                    title={
                      !p.isRestDay && paidDay
                        ? "To'lov qilingan kunni dam olish deb belgilab bo'lmaydi"
                        : undefined
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRestDay(p);
                    }}
                    className={`mt-3 inline-flex items-center gap-1 text-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                      p.isRestDay
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-muted-foreground hover:text-amber-700"
                    }`}
                  >
                    {p.isRestDay ? (
                      <>
                        <CalendarCheck size={14} /> Ish kuniga qaytarish
                      </>
                    ) : (
                      <>
                        <CalendarOff size={14} /> Dam olish kuni deb belgilash
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalWrapper name={MODAL.PAYMENT_DAY} title="Kunlik to'lov" className="max-w-md">
        <PaymentDayModal />
      </ModalWrapper>
    </div>
  );
};

export default PaymentsMonthView;
