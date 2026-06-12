import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import InputImages from "@/shared/components/ui/input/InputImages";
import { useCarDocumentUpdate } from "../../hooks/useCarDocumentMutations";

const toDateInput = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

const CarDocumentEditModal = ({ close, carId, document }) => {
  const { expiryDate, files, removeFileUrls, setField, setFields, state } =
    useObjectState({
      expiryDate: toDateInput(document?.expiryDate),
      files: [],
      removeFileUrls: [],
    });

  useEffect(() => {
    if (!document) return;
    setFields({
      expiryDate: toDateInput(document.expiryDate),
      files: [],
      removeFileUrls: [],
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
          {document?.documentType?.name || "-"}
        </span>
      </p>
      <InputField
        label="Muddati"
        type="date"
        value={expiryDate}
        onChange={(e) => setField("expiryDate", e.target.value)}
        disabled={isPending}
      />

      <InputImages
        label="Rasmlar"
        existing={document?.files || []}
        files={files}
        removedUrls={removeFileUrls}
        onAdd={(picked) => setField("files", [...files, ...picked])}
        onRemoveNew={(idx) =>
          setField(
            "files",
            files.filter((_, i) => i !== idx),
          )
        }
        onRemoveExisting={(url) =>
          setField("removeFileUrls", [...removeFileUrls, url])
        }
        onRestoreExisting={(url) =>
          setField(
            "removeFileUrls",
            removeFileUrls.filter((u) => u !== url),
          )
        }
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

export default CarDocumentEditModal;
