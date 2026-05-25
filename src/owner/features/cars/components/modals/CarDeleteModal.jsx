import Button from "@/shared/components/ui/button/Button";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import { useCarDelete } from "../../hooks/useCarMutations";

const CarDeleteModal = ({ close, car }) => {
  const { mutate, isPending } = useCarDelete();
  const handleDelete = () => {
    if (!car?._id) return;
    mutate(car._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-2">
          {car?.plateNumber && <PlateNumber value={car.plateNumber} size="sm" />}
          <span>mashinasini o'chirmoqchimisiz?</span>
        </div>
        <p>Mashina arxivlanadi.</p>
      </div>
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
