import { useState } from "react";
import { Paperclip } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { useDriversQuery } from "@/owner/features/drivers";
import { useDamageCreate } from "../../hooks/useDamageMutations";

const DamageCreateModal = ({ close, presetDriverId }) => {
  const { driverId, amount, incidentDate, note, setField, state } = useObjectState({
    driverId: presetDriverId || "",
    amount: "",
    incidentDate: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [files, setFiles] = useState([]);
  const { data: driversData } = useDriversQuery({ limit: 500, status: "active" });
  const driverOptions = (driversData?.data || []).map((d) => ({
    value: d._id,
    label: `${d.firstName} ${d.lastName} (${d.car?.plateNumber || "mashina yo'q"})`,
  }));
  const { mutate, isPending } = useDamageCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverId || !amount || !incidentDate) return;
    if (files.length === 0) return;
    const fd = new FormData();
    fd.append("driverId", driverId);
    fd.append("amount", String(Number(amount)));
    fd.append("incidentDate", incidentDate);
    if (note) fd.append("note", note);
    files.forEach((f) => fd.append("attachments", f));
    mutate(fd, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Haydovchi"
        searchable
        placeholder="Tanlang"
        searchPlaceholder="Ism yoki mashina raqami..."
        value={driverId}
        onChange={(v) => setField("driverId", v)}
        options={driverOptions}
        required
        disabled={isPending || !!presetDriverId}
      />
      <InputField
        label="Summa (so'm)"
        type="price"
        value={amount}
        onChange={(e) => setField("amount", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Sodir bo'lgan sana"
        type="date"
        value={incidentDate}
        onChange={(e) => setField("incidentDate", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={note}
        onChange={(e) => setField("note", e.target.value)}
        disabled={isPending}
      />

      <div>
        <label className="text-sm font-medium flex items-center gap-2">
          <Paperclip size={14} /> Rasm yoki hujjat <span className="text-primary">*</span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          disabled={isPending}
          required
          className="block w-full text-sm mt-1"
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">{files.length} ta fayl tanlandi</p>
        )}
        {files.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1">Urilgan mashina surati majburiy (max 5 MB)</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending || files.length === 0}>
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default DamageCreateModal;
