import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarUpdate } from "../../hooks/useCarMutations";

const toDateInput = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const CarEditModal = ({ close, car }) => {
  const {
    plateNumber,
    model,
    notes,
    licenseExpiryDate,
    powerOfAttorneyExpiryDate,
    setField,
    setFields,
    state,
  } = useObjectState({
    plateNumber: car?.plateNumber || "",
    model: car?.model || "",
    notes: car?.notes || "",
    licenseExpiryDate: toDateInput(car?.licenseExpiryDate),
    powerOfAttorneyExpiryDate: toDateInput(car?.powerOfAttorneyExpiryDate),
  });

  useEffect(() => {
    if (!car) return;
    setFields({
      plateNumber: car.plateNumber || "",
      model: car.model || "",
      notes: car.notes || "",
      licenseExpiryDate: toDateInput(car.licenseExpiryDate),
      powerOfAttorneyExpiryDate: toDateInput(car.powerOfAttorneyExpiryDate),
    });
  }, [car, setFields]);

  const { mutate, isPending } = useCarUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!car?._id) return;
    if (!model.trim()) return;
    mutate({ id: car._id, ...state }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Model"
        value={model}
        onChange={(e) => setField("model", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Davlat raqami"
        value={plateNumber}
        onChange={(e) => setField("plateNumber", e.target.value)}
        placeholder="01A001AA  "
        disabled={isPending}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          label="Litsenziya muddati"
          type="date"
          value={licenseExpiryDate}
          onChange={(e) => setField("licenseExpiryDate", e.target.value)}
          disabled={isPending}
        />
        <InputField
          label="Dovernost muddati"
          type="date"
          value={powerOfAttorneyExpiryDate}
          onChange={(e) => setField("powerOfAttorneyExpiryDate", e.target.value)}
          disabled={isPending}
        />
      </div>
      <InputField
        label="Izoh"
        type="textarea"
        value={notes}
        onChange={(e) => setField("notes", e.target.value)}
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default CarEditModal;
