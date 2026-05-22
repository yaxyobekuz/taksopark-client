import { useEffect, useMemo } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { PAYMENT_SOURCES, PAYMENT_SOURCE_LABELS } from "@/shared/constants/payments";
import { TARIFFS } from "@/shared/constants/tariffs";
import { useDriverBalanceQuery } from "@/owner/features/drivers";
import { useFinePaymentCreate, useFinePaymentsByFine, useFinePaymentDelete } from "../../hooks/useFinePayments";

const FinePayModal = ({ close, fine }) => {
  const driverId = fine?.driver?._id || fine?.driver;
  const { data: balance } = useDriverBalanceQuery(driverId);
  const { data: payments = [] } = useFinePaymentsByFine(fine?._id);
  const { mutate, isPending } = useFinePaymentCreate();
  const deleteMutation = useFinePaymentDelete();

  const remaining = useMemo(() => {
    if (!fine) return 0;
    return Math.max(0, fine.amount - fine.paidAmount);
  }, [fine]);

  const { amount, source, paidAt, note, setField, setFields } = useObjectState({
    amount: remaining,
    source: PAYMENT_SOURCES.DRIVER_CASH,
    paidAt: new Date().toISOString().slice(0, 10),
    note: "",
  });

  useEffect(() => {
    setFields({ amount: remaining });
  }, [remaining, setFields]);

  const tariff = balance?.tariff || balance?.driver?.tariff;
  const depositRemaining = balance?.deposit?.remaining ?? 0;
  const isDeposit = source === PAYMENT_SOURCES.DEPOSIT;
  const depositDisabled = tariff !== TARIFFS.DEPOSIT;

  const sourceOptions = [
    { value: PAYMENT_SOURCES.DRIVER_CASH, label: PAYMENT_SOURCE_LABELS.driver_cash },
    {
      value: PAYMENT_SOURCES.DEPOSIT,
      label: PAYMENT_SOURCE_LABELS.deposit + (depositDisabled ? " (faqat depozitli tarif)" : ` (mavjud: ${formatMoney(depositRemaining)})`),
      disabled: depositDisabled,
    },
    { value: PAYMENT_SOURCES.SYSTEM, label: PAYMENT_SOURCE_LABELS.system },
  ];

  const insufficient = isDeposit && Number(amount) > depositRemaining;
  const tooMuch = Number(amount) > remaining;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fine?._id || !amount || insufficient || tooMuch) return;
    mutate(
      {
        fineId: fine._id,
        amount: Number(amount),
        source,
        paidAt,
        note,
      },
      {
        onSuccess: () => {
          if (Number(amount) >= remaining) close();
          else setFields({ amount: Math.max(0, remaining - Number(amount)), note: "" });
        },
      },
    );
  };

  if (!fine) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/30 p-3 text-sm space-y-1">
        <div className="flex justify-between"><span className="text-muted-foreground">Jami jarima:</span> <span className="font-medium">{formatMoney(fine.amount)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">To'langan:</span> <span>{formatMoney(fine.paidAmount)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Qarz qoldig'i:</span> <span className="font-semibold text-primary">{formatMoney(remaining)}</span></div>
      </div>

      {remaining > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField
            label="To'lov manbai"
            value={source}
            onChange={(v) => setField("source", v)}
            options={sourceOptions}
            required
            disabled={isPending}
          />
          <InputField
            label="Summa (so'm)"
            type="price"
            value={amount}
            onChange={(e) => setField("amount", e.target.value)}
            required
            disabled={isPending}
            description={insufficient ? "Depozitda yetarli mablag' yo'q" : tooMuch ? "Qarz qoldig'idan oshib ketdi" : ""}
          />
          <InputField
            label="Sana"
            type="date"
            value={paidAt}
            onChange={(e) => setField("paidAt", e.target.value)}
            disabled={isPending}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
              Yopish
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending || !amount || insufficient || tooMuch}>
              {isPending ? "Saqlanmoqda..." : "To'lash"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3 text-center">
          Jarima to'liq to'langan
        </p>
      )}

      {payments.items?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">To'lovlar tarixi</h4>
          <div className="rounded-md border divide-y">
            {payments.items.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-2 text-sm">
                <div>
                  <div className="font-medium">{formatMoney(p.amount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {PAYMENT_SOURCE_LABELS[p.source]} · {formatDateUZ(p.paidAt)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(p._id)}
                  disabled={deleteMutation.isPending}
                  className="text-xs text-red-600 hover:underline"
                >
                  Bekor qilish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinePayModal;
