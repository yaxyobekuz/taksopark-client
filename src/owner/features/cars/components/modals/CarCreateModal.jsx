import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarCreate } from "../../hooks/useCarMutations";

const CarCreateModal = ({ close }) => {
  const {
    plateNumber,
    model,
    notes,
    licenseExpiryDate,
    powerOfAttorneyExpiryDate,
    setField,
    state,
    resetState,
  } = useObjectState({
    plateNumber: "",
    model: "",
    notes: "",
    licenseExpiryDate: "",
    powerOfAttorneyExpiryDate: "",
  });
  const { mutate, isPending } = useCarCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!model.trim()) return;
    mutate(state, {
      onSuccess: () => {
        resetState();
        close();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        placeholder="Yili, rangi, VIN va boshqa ma'lumotlar"
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

export default CarCreateModal;
