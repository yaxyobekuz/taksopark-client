import { useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import InputImage from "@/shared/components/ui/input/InputImage";
import { useDriverCreate } from "../../hooks/useDriverMutations";

const DriverCreateModal = ({ close }) => {
  const navigate = useNavigate();
  const { fullName, phone, notes, photoFile, setField, state } = useObjectState({
    fullName: "",
    phone: "+998",
    notes: "",
    photoFile: null,
  });

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
      notes: state.notes,
      photoFile,
    };
    mutate(payload, {
      onSuccess: (driver) => {
        close();
        if (driver?._id) navigate(`/owner/drivers/${driver._id}`);
      },
    });
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
