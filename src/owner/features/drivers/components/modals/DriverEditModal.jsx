import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";
import { useCarsQuery } from "@/owner/features/cars";
import { useDriverUpdate } from "../../hooks/useDriverMutations";

const buildFullName = (driver) =>
  driver ? `${driver.firstName || ""} ${driver.lastName || ""}`.trim() : "";

const DriverEditModal = ({ close, driver }) => {
  const { fullName, phone, carId, notes, photoFile, setField, setFields, state } = useObjectState({
    fullName: buildFullName(driver),
    phone: driver?.phone || "",
    carId: driver?.car?._id || driver?.car || "",
    notes: driver?.notes || "",
    photoFile: null,
  });

  useEffect(() => {
    if (!driver) return;
    setFields({
      fullName: buildFullName(driver),
      phone: driver.phone || "",
      carId: driver.car?._id || driver.car || "",
      notes: driver.notes || "",
      photoFile: null,
    });
  }, [driver, setFields]);

  const { data: carsData } = useCarsQuery({ limit: 500, isActive: "true" });
  const carOptions = (carsData?.data || []).map((c) => ({
    value: c._id,
    label: `${c.plateNumber || "-"} - ${c.model}`,
  }));

  const { mutate, isPending } = useDriverUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver?._id) return;
    if (!fullName.trim()) return;
    const parts = fullName.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : "";
    const firstName = parts.join(" ");
    mutate(
      {
        id: driver._id,
        firstName,
        lastName,
        phone: state.phone,
        carId: carId || null,
        notes: state.notes,
        photoFile,
      },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputImage
        label="Haydovchi rasmi"
        value={driver?.photoUrl}
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

export default DriverEditModal;
