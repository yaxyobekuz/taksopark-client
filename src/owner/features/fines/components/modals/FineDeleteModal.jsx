import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useFineDelete } from "../../hooks/useFineMutations";

const FineDeleteModal = ({ close, fine }) => {
  const { mutate, isPending } = useFineDelete();
  const handleDelete = () => {
    if (!fine?._id) return;
    mutate(fine._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{formatMoney(fine?.amount)}</span> jarimasini o'chirmoqchimisiz?
        Depozit yoki tsikl summasi qaytariladi.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button variant="danger" className="flex-1" onClick={handleDelete} disabled={isPending}>
          {isPending ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </div>
    </div>
  );
};

export default FineDeleteModal;
