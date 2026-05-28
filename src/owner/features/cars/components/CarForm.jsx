import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";

const emptyState = (car) => ({
  plateNumber: car?.plateNumber || "",
  model: car?.model || "",
  dailyPaymentDeposit: car?.dailyPaymentDeposit ?? "",
  dailyPaymentNoDeposit: car?.dailyPaymentNoDeposit ?? "",
  monthlyCashback: car?.monthlyCashback ?? "",
  notes: car?.notes || "",
  photoFile: null,
});

const CarForm = ({ car, isPending, submitLabel = "Saqlash", onSubmit, onCancel }) => {
  const {
    plateNumber,
    model,
    dailyPaymentDeposit,
    dailyPaymentNoDeposit,
    monthlyCashback,
    notes,
    photoFile,
    setField,
    setFields,
    state,
  } = useObjectState(emptyState(car));

  useEffect(() => {
    if (car) setFields(emptyState(car));
  }, [car, setFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!model.trim()) return;
    if (dailyPaymentDeposit === "" || dailyPaymentNoDeposit === "" || monthlyCashback === "") return;
    onSubmit(state);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputImage
        label="Mashina rasmi"
        value={car?.photoUrl}
        file={photoFile}
        onChange={(f) => setField("photoFile", f)}
        disabled={isPending}
      />
      <InputField
        label="Model"
        value={model}
        onChange={(e) => setField("model", e.target.value)}
        placeholder="Cobalt"
        required
        disabled={isPending}
      />
      <InputField
        label="Davlat raqami"
        value={plateNumber}
        onChange={(e) => setField("plateNumber", e.target.value)}
        placeholder="01A001AA"
        disabled={isPending}
      />
      <InputField
        label="Depozitli kunlik to'lov (UZS)"
        type="price"
        value={dailyPaymentDeposit}
        onChange={(e) => setField("dailyPaymentDeposit", e.target.value)}
        placeholder="500 000"
        required
        disabled={isPending}
      />
      <InputField
        label="Depozitsiz kunlik to'lov (UZS)"
        type="price"
        value={dailyPaymentNoDeposit}
        onChange={(e) => setField("dailyPaymentNoDeposit", e.target.value)}
        placeholder="560 000"
        required
        disabled={isPending}
      />
      <InputField
        label="Oylik cashback (UZS)"
        type="price"
        value={monthlyCashback}
        onChange={(e) => setField("monthlyCashback", e.target.value)}
        placeholder="5 500 000"
        required
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={notes}
        onChange={(e) => setField("notes", e.target.value)}
        placeholder="Yili, rangi, VIN va boshqa ma'lumotlar"
        disabled={isPending}
      />
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
            Bekor qilish
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saqlanmoqda..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default CarForm;
