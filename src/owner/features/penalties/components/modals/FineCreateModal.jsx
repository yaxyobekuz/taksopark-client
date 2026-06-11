import { useState } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { useDriversQuery } from "@/owner/features/drivers";
import { useFineCreate } from "../../hooks/useFineMutations";

const FineCreateModal = ({ close, presetDriverId }) => {
  const { driverId, amount, issueDate, note, setField, state } = useObjectState({
    driverId: presetDriverId || "",
    amount: "",
    issueDate: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [files, setFiles] = useState([]);
  const { data: driversData } = useDriversQuery({ limit: 500, status: "active" });
  const driverOptions = (driversData?.data || []).map((d) => ({
    value: d._id,
    label: `${d.firstName} ${d.lastName} (${d.car?.plateNumber || "mashina yo'q"})`,
  }));
  const { mutate, isPending } = useFineCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverId || !amount || !issueDate) return;
    if (files.length === 0) return;
    const fd = new FormData();
    fd.append("driverId", driverId);
    fd.append("amount", String(Number(amount)));
    fd.append("issueDate", issueDate);
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
        label="Sana"
        type="date"
        value={issueDate}
        onChange={(e) => setField("issueDate", e.target.value)}
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

      <InputField
        label="Hujjat yoki rasm"
        type="file"
        multiple
        accept="image/*,application/pdf"
        maxSizeMB={5}
        files={files}
        onChange={setFiles}
        description="Jarima qarori yoki rasm yuklang"
        required
        disabled={isPending}
      />

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

export default FineCreateModal;
