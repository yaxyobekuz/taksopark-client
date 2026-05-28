import Button from "@/shared/components/ui/button/Button";
import { useDriverDocumentTypeDelete } from "../../hooks/useDriverDocumentTypeMutations";

const DriverDocumentTypeDeleteModal = ({ close, docType }) => {
  const { mutate, isPending } = useDriverDocumentTypeDelete();

  const handleConfirm = () => {
    if (!docType?._id) return;
    mutate(docType._id, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{docType?.name}</span> hujjat turini o'chirmoqchimisiz?
      </p>
      <p className="text-xs text-muted-foreground">
        Bu turdan foydalanayotgan haydovchilar bo'lsa o'chirib bo'lmaydi.
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="button"  className="flex-1" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </div>
    </div>
  );
};

export default DriverDocumentTypeDeleteModal;
