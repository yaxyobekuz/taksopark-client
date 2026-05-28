import Button from "@/shared/components/ui/button/Button";
import { useTransactionCategoryDelete } from "../../hooks/useTransactionCategoryMutations";

const TransactionCategoryDeleteModal = ({ close, category }) => {
  const { mutate, isPending } = useTransactionCategoryDelete();

  const handleConfirm = () => {
    if (!category?._id) return;
    mutate(category._id, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{category?.name}</span> kategoriyasini o'chirmoqchimisiz?
      </p>
      <p className="text-xs text-muted-foreground">
        Bu kategoriya bo'yicha tranzaksiyalar mavjud bo'lsa o'chirib bo'lmaydi.
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

export default TransactionCategoryDeleteModal;
