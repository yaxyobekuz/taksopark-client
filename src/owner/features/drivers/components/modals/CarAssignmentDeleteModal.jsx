import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useCarAssignmentDelete } from "../../hooks/useCarAssignmentMutations";

const CarAssignmentDeleteModal = ({ close, driverId, assignment }) => {
  const { mutate, isPending } = useCarAssignmentDelete(driverId);

  const handleDelete = () => {
    if (!assignment?._id) return;
    mutate(assignment._id, { onSuccess: () => close() });
  };

  const carLabel = assignment?.car
    ? `${assignment.car.plateNumber || "-"} - ${assignment.car.model}`
    : "Mashina";

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center justify-center size-10 rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-gray-700 pt-1.5">
          {assignment
            ? `${carLabel} biriktirishi (${formatDateUZ(assignment.startDate)} dan) o'chiriladi.`
            : "Mashina biriktirishi o'chiriladi."}
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="button" variant="danger" className="flex-1" onClick={handleDelete} disabled={isPending}>
          {isPending ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </div>
    </div>
  );
};

export default CarAssignmentDeleteModal;
