import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarDocumentTypeUpdate } from "../../hooks/useCarDocumentTypeMutations";

const CarDocumentTypeEditModal = ({ close, docType }) => {
  const { name, setField, setFields, state } = useObjectState({
    name: docType?.name || "",
  });

  useEffect(() => {
    if (docType) setFields({ name: docType.name || "" });
  }, [docType, setFields]);

  const { mutate, isPending } = useCarDocumentTypeUpdate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docType?._id || !name.trim()) return;
    mutate({ id: docType._id, ...state }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Nom"
        value={name}
        onChange={(e) => setField("name", e.target.value)}
        required
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

export default CarDocumentTypeEditModal;
