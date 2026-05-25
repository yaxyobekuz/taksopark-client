import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import ImageUpload from "@/shared/components/ui/image-upload/ImageUpload";
import { useCarCreate } from "../../hooks/useCarMutations";

const CarCreateModal = ({ close }) => {
  const {
    plateNumber,
    model,
    notes,
    photoFile,
    setField,
    state,
    resetState,
  } = useObjectState({
    plateNumber: "",
    model: "",
    notes: "",
    photoFile: null,
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
      <ImageUpload
        label="Mashina rasmi"
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
        placeholder="01A001AA  "
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
