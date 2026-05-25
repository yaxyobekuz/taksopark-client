import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";
import { TARIFF_OPTIONS, TARIFFS } from "@/shared/constants/tariffs";
import { useCarsQuery } from "@/owner/features/cars";
import { useDriverCreate } from "../../hooks/useDriverMutations";

const DriverCreateModal = ({ close }) => {
  const { fullName, phone, tariff, carId, startDate, notes, photoFile, setField, state } = useObjectState({
    fullName: "",
    phone: "+998",
    tariff: TARIFFS.DEPOSIT,
    carId: "",
    startDate: new Date().toISOString().slice(0, 10),
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
    if (!fullName.trim() || !phone || !startDate) return;
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : "";
    const firstName = parts.join(" ");
    const payload = {
      firstName,
      lastName,
      phone: state.phone,
      tariff: state.tariff,
      carId: carId || null,
      startDate: state.startDate,
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
        label="Tarif"
        value={tariff}
        onChange={(v) => setField("tariff", v)}
        options={TARIFF_OPTIONS}
        required
        disabled={isPending}
      />
      <SelectField
        label="Mashina"
        value={carId}
        onChange={(v) => setField("carId", v)}
        options={[{ value: "", label: "- Tanlanmagan -" }, ...carOptions]}
        disabled={isPending}
        description={tariff === TARIFFS.DEPOSIT ? "Depozitli tarif uchun majburiy" : ""}
      />
      <InputField
        label="Ish boshlash sanasi"
        type="date"
        value={startDate}
        onChange={(e) => setField("startDate", e.target.value)}
        required
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
