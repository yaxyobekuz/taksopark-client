import Button from "@/shared/components/ui/button/Button";
import { useDriverDocumentRemove } from "../../hooks/useDriverDocumentMutations";

const DriverDocumentDeleteModal = ({ close, driverId, document }) => {
  const { mutate, isPending } = useDriverDocumentRemove();

  const handleConfirm = () => {
    if (!driverId || !document?._id) return;
    mutate({ driverId, docId: document._id }, { onSuccess: () => close() });
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

export default DriverDocumentDeleteModal;
