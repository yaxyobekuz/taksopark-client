import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import ImageUpload from "@/shared/components/ui/image-upload/ImageUpload";
import { useCarDocumentUpdate } from "../../hooks/useCarDocumentMutations";

const toDateInput = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const CarDocumentEditModal = ({ close, carId, document }) => {
  const { expiryDate, file, removeFile, setField, setFields, state } =
    useObjectState({
      expiryDate: toDateInput(document?.expiryDate),
      file: null,
      removeFile: false,
    });

  useEffect(() => {
    if (!document) return;
    setFields({
      expiryDate: toDateInput(document.expiryDate),
      file: null,
      removeFile: false,
    });
  }, [document, setFields]);

  const { mutate, isPending } = useCarDocumentUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carId || !document?._id) return;
    mutate(
      { carId, docId: document._id, ...state },
      { onSuccess: () => close() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm">
        Hujjat turi:{" "}
        <span className="font-semibold">
          {document?.documentType?.name || "—"}
        </span>
      </p>
      <InputField
        label="Muddati"
        type="date"
        value={expiryDate}
        onChange={(e) => setField("expiryDate", e.target.value)}
        disabled={isPending}
      />

      <div className="space-y-2">
        <ImageUpload
          label="Fayl"
          file={file}
          value={!file && !removeFile ? document?.file?.url || "" : ""}
          onChange={(f) => {
            setField("file", f);
            if (f) setField("removeFile", false);
          }}
          disabled={isPending}
        />
        {document?.file?.url && !file && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeFile}
              onChange={(e) => setField("removeFile", e.target.checked)}
              disabled={isPending}
            />
            Mavjud faylni o'chirish
          </label>
        )}
      </div>

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

export default CarDocumentEditModal;
