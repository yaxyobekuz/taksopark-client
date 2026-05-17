import Button from "@/shared/components/ui/button/Button";
import { useDriverDelete } from "../../hooks/useDriverMutations";

const DriverDeleteModal = ({ close, driver }) => {
  const { mutate, isPending } = useDriverDelete();
  const handleDelete = () => {
    if (!driver?._id) return;
    mutate(driver._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{driver?.firstName} {driver?.lastName}</span> ni
        arxivlamoqchimisiz? Mashina bilan bog'lanish bekor qilinadi.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button variant="danger" className="flex-1" onClick={handleDelete} disabled={isPending}>
          {isPending ? "Bajarilmoqda..." : "Arxivlash"}
        </Button>
      </div>
    </div>
  );
};

export default DriverDeleteModal;
