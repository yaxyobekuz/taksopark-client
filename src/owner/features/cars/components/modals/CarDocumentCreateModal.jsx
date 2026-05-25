import { useMemo } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import ImageUpload from "@/shared/components/ui/image-upload/ImageUpload";
import { useCarDocumentTypesQuery } from "@/owner/features/carDocumentTypes";
import { useCarDocumentAdd } from "../../hooks/useCarDocumentMutations";

const CarDocumentCreateModal = ({ close, carId }) => {
  const { documentType, expiryDate, file, setField, state, resetState } =
    useObjectState({ documentType: "", expiryDate: "", file: null });

  const { data: types = [], isLoading: typesLoading } =
    useCarDocumentTypesQuery();
  const { mutate, isPending } = useCarDocumentAdd();

  const options = useMemo(
    () => types.map((t) => ({ value: t._id, label: t.name })),
    [types],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carId || !documentType) return;
    mutate(
      { carId, ...state },
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
      <ImageUpload
        label="Fayl (rasm yoki PDF)"
        file={file}
        onChange={(f) => setField("file", f)}
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

export default CarDocumentCreateModal;
