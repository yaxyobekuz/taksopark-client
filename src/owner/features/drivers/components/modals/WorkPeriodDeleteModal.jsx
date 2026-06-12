import { AlertTriangle } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import { TARIFF_LABELS } from "@/shared/constants/tariffs";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useWorkPeriodDelete } from "../../hooks/useWorkPeriodMutations";

const WorkPeriodDeleteModal = ({ close, driverId, period }) => {
  const { mutate, isPending } = useWorkPeriodDelete(driverId);

  const handleDelete = () => {
    if (!period?._id) return;
    mutate(period._id, { onSuccess: () => close() });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center justify-center size-10 rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-gray-700 pt-1.5">
          {period
            ? `${TARIFF_LABELS[period.tariff] || period.tariff} davri (${formatDateUZ(period.startDate)} dan) o'chiriladi. Bu amalni qaytarib bo'lmaydi.`
            : "Ish davri o'chiriladi."}
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

export default WorkPeriodDeleteModal;
