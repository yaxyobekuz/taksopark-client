import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarsQuery } from "@/owner/features/cars";
import { useCarChange } from "../../hooks/useCarAssignmentMutations";

// Tezkor "mashinani almashtirish": tanlangan sanadan boshlab yangi mashina biriktiriladi,
// joriy biriktirish o'sha sanadan oldin yakunlanadi (§2). To'liq tarix - "Mashina biriktirish" tabida.
const DriverChangeCarModal = ({ close, driver }) => {
  const currentCarId = driver?.car?._id || driver?.car || "";
  const { carId, fromDate, setField, state } = useObjectState({
    carId: "",
    fromDate: new Date().toISOString().slice(0, 10),
  });

  const { data: carsData } = useCarsQuery({ limit: 500, isActive: "true" });
  const carOptions = (carsData?.data || [])
    .filter((c) => String(c._id) !== String(currentCarId))
    .map((c) => ({ value: c._id, label: `${c.plateNumber || "-"} - ${c.model}` }));

  const { mutate, isPending } = useCarChange(driver?._id);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!driver?._id || !carId || !fromDate) return;
    mutate(
      { driverId: driver._id, carId: state.carId, fromDate: state.fromDate },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleConfirm} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {driver?.firstName} {driver?.lastName}
        </span>{" "}
        uchun yangi mashina biriktiriladi. Eski biriktirish tanlangan sanadan oldin yakunlanadi.
      </p>

      <SelectField
        label="Yangi mashina"
        value={carId}
        onChange={(v) => setField("carId", v)}
        options={[{ value: "", label: "- Mashinani tanlang -" }, ...carOptions]}
        disabled={isPending}
      />
      <InputField
        label="Qaysi sanadan"
        type="date"
        value={fromDate}
        onChange={(e) => setField("fromDate", e.target.value)}
        required
        disabled={isPending}
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending || !carId || !fromDate}>
          {isPending ? "Saqlanmoqda..." : "Tasdiqlash"}
        </Button>
      </div>
    </form>
  );
};

export default DriverChangeCarModal;
