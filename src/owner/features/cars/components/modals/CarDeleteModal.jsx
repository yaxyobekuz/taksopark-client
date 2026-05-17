import Button from "@/shared/components/ui/button/Button";
import { useCarDelete } from "../../hooks/useCarMutations";

const CarDeleteModal = ({ close, car }) => {
  const { mutate, isPending } = useCarDelete();
  const handleDelete = () => {
    if (!car?._id) return;
    mutate(car._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{car?.plateNumber}</span> mashinasini o'chirmoqchimisiz?
        Mashina arxivlanadi.
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

export default CarDeleteModal;
