import { useMemo } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import InputImages from "@/shared/components/ui/input/InputImages";
import { useDriverDocumentTypesQuery } from "@/owner/features/driverDocumentTypes";
import { useDriverDocumentAdd } from "../../hooks/useDriverDocumentMutations";

const DriverDocumentCreateModal = ({ close, driverId }) => {
  const { documentType, expiryDate, files, setField, state, resetState } =
    useObjectState({ documentType: "", expiryDate: "", files: [] });

  const { data: types = [], isLoading: typesLoading } =
    useDriverDocumentTypesQuery();
  const { mutate, isPending } = useDriverDocumentAdd();

  const options = useMemo(
    () => types.map((t) => ({ value: t._id, label: t.name })),
    [types],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driverId || !documentType) return;
    mutate(
      { driverId, ...state },
      {
        onSuccess: () => {
          resetState();
          close();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Hujjat turi"
        value={documentType}
        onChange={(v) => setField("documentType", v)}
        options={options}
        isLoading={typesLoading}
        placeholder="Tanlang"
        required
        disabled={isPending}
      />
      <InputField
        label="Muddati"
        type="date"
        value={expiryDate}
        onChange={(e) => setField("expiryDate", e.target.value)}
        disabled={isPending}
      />
      <InputImages
        label="Rasmlar"
        files={files}
        onAdd={(picked) => setField("files", [...files, ...picked])}
        onRemoveNew={(idx) =>
          setField(
            "files",
            files.filter((_, i) => i !== idx),
          )
        }
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={isPending || !documentType} className="flex-1">
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default DriverDocumentCreateModal;
