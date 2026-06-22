import { useState } from "react";
import { Undo2, Plus, Trash2 } from "lucide-react";

import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import Switch from "@/shared/components/ui/switch/Switch";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";

import { usePlanTransactionsQuery } from "../../hooks/usePaymentsQuery";
import {
  usePaymentCreate,
  usePaymentReverse,
  usePaymentReleaseAuto,
} from "../../hooks/usePaymentMutations";
import { useDriverAutoSettleToggle } from "../../hooks/useDriverMutations";
import { planStatus, paidFromTransactions } from "../../utils/payment.utils";

const TX_LABELS = { payment: "To'lov", reversal: "Bekor qilingan" };
const SOURCE_LABELS = { deposit: "Depozitdan", cashback: "Keshbekdan" };

const PaymentDayModal = ({
  close,
  plan,
  canManage,
  autoSettleDaily = true,
  driverId,
  showAutoToggle = false,
}) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  // Toggle modal ichida bo'lsa - lokal holat darhol UI ni yangilaydi (mutatsiya
  // hisobni qayta hisoblagunча). Toggle ko'rsatilmasa - prop qiymati o'zgarmaydi.
  const [autoEnabled, setAutoEnabled] = useState(autoSettleDaily);

  const { data: transactions = [], isLoading } = usePlanTransactionsQuery(plan?._id);
  const create = usePaymentCreate();
  const reverse = usePaymentReverse();
  const releaseAuto = usePaymentReleaseAuto();
  const autoToggle = useDriverAutoSettleToggle();

  if (!plan) return null;

  // To'langan/qarz - tranzaksiyalardan jonli hisoblanadi (snapshot eskirmasin).
  const paid = paidFromTransactions(transactions);
  const debt = Math.max(0, (plan.planAmount || 0) - paid);
  const status = planStatus({ ...plan, paidAmount: paid, debt });

  const reversedIds = new Set(transactions.filter((t) => t.reverses).map((t) => String(t.reverses)));
  const canPay = canManage && !plan.isRestDay && !plan.priceMissing;

  const handlePay = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    create.mutate(
      { dailyPlanId: plan._id, amount: value, note },
      { onSuccess: () => { setAmount(""); setNote(""); } },
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Reja</p>
          <p className="text-sm font-semibold">{formatMoney(plan.planAmount)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">To'langan</p>
          <p className="text-sm font-semibold text-green-700">{formatMoney(paid)}</p>
        </div>
        <div className="rounded-lg border p-2">
          <p className="text-[11px] text-muted-foreground">Qarz</p>
          <p className="text-sm font-semibold text-rose-700">{formatMoney(debt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{formatDateUZ(plan.date)}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${status.className}`}>{status.label}</span>
      </div>

      {/* Avtomatik qoplash toggle (Moliya sahifasidagi kun modalida) - bu kun depozit/
          keshbekdan avtomatik qoplangan tranzaksiyani o'chirish uchun avval o'chiriladi. */}
      {showAutoToggle && canManage && driverId && (
        <div className="flex items-start justify-between gap-3 rounded-lg border p-2.5">
          <div className="text-xs">
            <p className="font-medium">Avtomatik qoplash</p>
            <p className="text-muted-foreground">
              {autoEnabled
                ? "Kunlik qarz depozit/keshbekdan avtomatik qoplanadi"
                : "O'chirilgan - avtomatik qoplangan tranzaksiyani o'chirish mumkin"}
            </p>
          </div>
          <Switch
            checked={autoEnabled}
            disabled={autoToggle.isPending}
            onChange={(enabled) => {
              setAutoEnabled(enabled);
              autoToggle.mutate({ id: driverId, enabled });
            }}
          />
        </div>
      )}

      {plan.isRestDay && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded p-2">
          Dam olish kuni - bu kun uchun to'lov majburiyati yo'q.
        </p>
      )}
      {plan.priceMissing && !plan.isRestDay && (
        <p className="text-xs text-muted-foreground bg-gray-50 rounded p-2">
          Bu kunga mashina narx davri belgilanmagan - to'lov kiritib bo'lmaydi.
        </p>
      )}

      {canPay && (
        <form onSubmit={handlePay} className="space-y-2 border-t pt-3">
          <div className="flex items-end gap-2">
            <InputField
              label="To'lov summasi"
              type="price"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1"
              disabled={create.isPending}
            />
            <Button type="submit" disabled={create.isPending || !Number(amount)}>
              <Plus size={16} className="mr-1" /> Qo'shish
            </Button>
          </div>
          <InputField
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Izoh (ixtiyoriy)"
            disabled={create.isPending}
          />
        </form>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Tranzaksiyalar</p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        ) : transactions.length === 0 ? (
          <EmptyState title="Tranzaksiya yo'q" />
        ) : (
          <div className="space-y-1.5">
            {transactions.map((t) => {
              const isReversed = reversedIds.has(String(t._id));
              const isReversal = t.type === "reversal";
              const fromSource = t.source && t.source !== "driver";
              return (
                <div
                  key={t._id}
                  className={`flex items-center justify-between gap-2 rounded-md border p-2 text-sm ${
                    isReversal || isReversed ? "opacity-60" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {isReversal ? "−" : ""}
                      {formatMoney(t.amount)}
                      <span className="ml-2 text-[11px] text-muted-foreground">
                        {fromSource ? SOURCE_LABELS[t.source] : TX_LABELS[t.type] || t.type}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDateUZ(t.createdAt)}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                  {canManage && !isReversal && !isReversed && !fromSource && (
                    <button
                      type="button"
                      onClick={() => reverse.mutate({ id: t._id })}
                      disabled={reverse.isPending}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 shrink-0"
                      title="Bekor qilish"
                    >
                      <Undo2 size={15} />
                    </button>
                  )}
                  {/* Auto (depozit/keshbek) qoplashni o'chirish - faqat avtomatik qoplash
                      O'CHIRILGAN bo'lsa, aks holda darhol qayta yaratiladi (loop). */}
                  {canManage && fromSource && !isReversal && !autoEnabled && (
                    <button
                      type="button"
                      onClick={() => releaseAuto.mutate(plan._id)}
                      disabled={releaseAuto.isPending}
                      className="p-1.5 text-muted-foreground hover:text-rose-600 shrink-0"
                      title="Avtomatik qoplashni o'chirish (pul manbaga qaytadi)"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Auto-qoplangan kun bor, lekin avtomatik qoplash YOQILGAN - o'chirishdan oldin
            uni o'chirish kerakligini eslatamiz. */}
        {canManage &&
          autoEnabled &&
          transactions.some((t) => t.source && t.source !== "driver" && t.type !== "reversal") && (
            <p className="text-[11px] text-amber-700 bg-amber-50 rounded p-2">
              Bu kun depozit/keshbekdan avtomatik qoplangan. O'chirish uchun avval yuqoridagi
              "Avtomatik qoplash" ni o'chiring.
            </p>
          )}
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={() => close()}>
        Yopish
      </Button>
    </div>
  );
};

export default PaymentDayModal;
