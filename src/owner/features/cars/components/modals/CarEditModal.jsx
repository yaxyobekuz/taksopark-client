import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarUpdate } from "../../hooks/useCarMutations";

const CarEditModal = ({ close, car }) => {
  const { plateNumber, model, notes, setField, setFields, state } = useObjectState({
    plateNumber: car?.plateNumber || "",
    model: car?.model || "",
    notes: car?.notes || "",
  });

  useEffect(() => {
    if (!car) return;
    setFields({
      plateNumber: car.plateNumber || "",
      model: car.model || "",
      notes: car.notes || "",
    });
  }, [car]);

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
