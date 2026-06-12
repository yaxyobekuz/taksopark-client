import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";
import { useCarsQuery } from "@/owner/features/cars";
import { useDriverCreate } from "../../hooks/useDriverMutations";

const DriverCreateModal = ({ close }) => {
  const { fullName, phone, carId, notes, photoFile, setField, state } = useObjectState({
    fullName: "",
    phone: "+998",
    carId: "",
    notes: "",
    photoFile: null,
  });

  const { data: carsData } = useCarsQuery({ limit: 500, isActive: "true" });
  const carOptions = (carsData?.data || []).map((c) => ({
    value: c._id,
    label: `${c.plateNumber || "-"} - ${c.model}`,
    disabled: !!c.currentDriver,
  }));

  const { mutate, isPending } = useDriverCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone) return;
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : "";
    const firstName = parts.join(" ");
    const payload = {
      firstName,
      lastName,
      phone: state.phone,
      carId: carId || null,
      notes: state.notes,
      photoFile,
    };
    mutate(payload, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputImage
        label="Haydovchi rasmi"
        file={photoFile}
        onChange={(f) => setField("photoFile", f)}
        disabled={isPending}
      />
      <InputField
        label="F.I.SH"
        value={fullName}
        onChange={(e) => setField("fullName", e.target.value)}
        placeholder="Ali Valiyev"
        required
        disabled={isPending}
      />
      <InputField
        label="Telefon"
        type="tel"
        value={phone}
        onChange={(e) => setField("phone", e.target.value)}
        required
        disabled={isPending}
      />
      <SelectField
        label="Mashina"
        value={carId}
        onChange={(v) => setField("carId", v)}
        options={[{ value: "", label: "- Tanlanmagan -" }, ...carOptions]}
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={notes}
        onChange={(e) => setField("notes", e.target.value)}
        placeholder="Passport, guvohnoma, manzil va boshqa ma'lumotlar"
        disabled={isPending}
      />
      <p className="text-xs text-muted-foreground">
        Ish boshlash sanasi va tarif haydovchi sahifasidagi "Ish davrlari"
        tabida birinchi davr qo'shilganda belgilanadi.
      </p>
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

export default DriverCreateModal;
