import Button from "@/shared/components/ui/button/Button";
import { useCarDocumentRemove } from "../../hooks/useCarDocumentMutations";

const CarDocumentDeleteModal = ({ close, carId, document }) => {
  const { mutate, isPending } = useCarDocumentRemove();

  const handleConfirm = () => {
    if (!carId || !document?._id) return;
    mutate({ carId, docId: document._id }, { onSuccess: () => close() });
  };

  const fileCount = document?.files?.length || 0;

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">
          {document?.documentType?.name || "Hujjat"}
        </span>{" "}
        ni o'chirmoqchimisiz?
      </p>
      {fileCount > 0 && (
        <p className="text-xs text-muted-foreground">
          Biriktirilgan {fileCount} ta fayl ham serverdan o'chiriladi.
        </p>
      )}
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="button" variant="destructive" className="flex-1" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </div>
    </div>
  );
};

export default CarDocumentDeleteModal;
