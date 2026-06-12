import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";

const emptyState = (car) => ({
  plateNumber: car?.plateNumber || "",
  model: car?.model || "",
  notes: car?.notes || "",
  photoFile: null,
});

const CarForm = ({
  car,
  isPending,
  submitLabel = "Saqlash",
  onSubmit,
  onCancel,
  columns = 1,
}) => {
  const {
    plateNumber,
    model,
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
    onSubmit(state);
  };

  const two = columns === 2;
  const fullSpan = two ? "sm:col-span-2" : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={two ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
        <div className={fullSpan}>
          <InputImage
            label="Mashina rasmi"
            value={car?.photoUrl}
            file={photoFile}
            onChange={(f) => setField("photoFile", f)}
            disabled={isPending}
          />
        </div>
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
          label="Izoh"
          type="textarea"
          className={fullSpan}
          value={notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Yili, rangi, VIN va boshqa ma'lumotlar"
          disabled={isPending}
        />
      </div>
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
