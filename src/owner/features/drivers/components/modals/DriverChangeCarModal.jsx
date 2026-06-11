import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { useCarsQuery } from "@/owner/features/cars";
import { useDriverChangeCar } from "../../hooks/useDriverMutations";

const DriverChangeCarModal = ({ close, driver }) => {
  const currentCarId = driver?.car?._id || driver?.car || "";
  const { carId, setField, setFields } = useObjectState({ carId: currentCarId });

  useEffect(() => {
    setFields({ carId: driver?.car?._id || driver?.car || "" });
  }, [driver, setFields]);

  const { data: carsData } = useCarsQuery({ limit: 500, isActive: "true" });
  const carOptions = (carsData?.data || []).map((c) => ({
    value: c._id,
    label: `${c.plateNumber || "-"} - ${c.model}`,
  }));

  const options = [{ value: "", label: "- Biriktirilmagan -" }, ...carOptions];

  const { mutate, isPending } = useDriverChangeCar();

  const changed = String(carId || "") !== String(currentCarId || "");

  const handleConfirm = () => {
    if (!driver?._id || !changed) return;
    mutate({ id: driver._id, carId }, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {driver?.firstName} {driver?.lastName}
        </span>{" "}
        haydovchiga biriktirilgan mashinani almashtirasiz.
      </p>

      <SelectField
        label="Mashina"
        value={carId}
        onChange={(v) => setField("carId", v)}
        options={options}
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
        <Button
          className="flex-1"
          onClick={handleConfirm}
          disabled={isPending || !changed}
        >
          {isPending ? "Saqlanmoqda..." : "Tasdiqlash"}
        </Button>
      </div>
    </div>
  );
};

export default DriverChangeCarModal;
