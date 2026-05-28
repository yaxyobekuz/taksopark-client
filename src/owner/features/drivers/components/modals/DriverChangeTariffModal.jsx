import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { TARIFFS, TARIFF_LABELS } from "@/shared/constants/tariffs";
import { useDriverChangeTariff } from "../../hooks/useDriverMutations";

const DriverChangeTariffModal = ({ close, driver }) => {
  const { mutate, isPending } = useDriverChangeTariff();
  const { note, setField } = useObjectState({ note: "" });

  const current = driver?.tariff;
  const target = current === TARIFFS.DEPOSIT ? TARIFFS.NO_DEPOSIT : TARIFFS.DEPOSIT;
  const toDeposit = target === TARIFFS.DEPOSIT;

  const handleConfirm = () => {
    if (!driver?._id) return;
    mutate({ id: driver._id, tariff: target, note }, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">
          {driver?.firstName} {driver?.lastName}
        </span>{" "}
        haydovchini{" "}
        <span className="font-semibold">{TARIFF_LABELS[current]}</span> tarifidan{" "}
        <span className="font-semibold">{TARIFF_LABELS[target]}</span> tarifiga
        o'tkazasiz.
      </p>

      <div className="rounded bg-blue-50 border border-blue-200 p-3 text-sm text-blue-900">
        {toDeposit ? (
          <>
            Hisoblangan, hali to'lanmagan oylik cashback summasi haydovchining
            depozitiga qo'shiladi. Oylik fazasi yopiladi.
          </>
        ) : (
          <>
            Haydovchining qolgan depoziti unga qaytariladi (chiqim sifatida
            yoziladi). Oylik cashback shu sanadan boshlab darhol hisoblana
            boshlaydi (sinovsiz).
          </>
        )}
        {" "}Qarz (agar bo'lsa) saqlanib qoladi.
      </div>

      <InputField
        label="Izoh"
        type="textarea"
        value={note}
        onChange={(e) => setField("note", e.target.value)}
        placeholder="O'zgartirish sababi"
        disabled={isPending}
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => close()}
          disabled={isPending}
        >
          Bekor qilish
        </Button>
        <Button className="flex-1" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Saqlanmoqda..." : "Tasdiqlash"}
        </Button>
      </div>
    </div>
  );
};

export default DriverChangeTariffModal;
