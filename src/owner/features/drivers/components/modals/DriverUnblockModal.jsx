import Button from "@/shared/components/ui/button/Button";
import { useDriverUnblock } from "../../hooks/useDriverMutations";

const DriverUnblockModal = ({ close, driver }) => {
  const { mutate, isPending } = useDriverUnblock();
  const handleClick = () => {
    if (!driver?._id) return;
    mutate(driver._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{driver?.firstName} {driver?.lastName}</span> ni
        blokdan chiqarmoqchimisiz?
      </p>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button className="flex-1" onClick={handleClick} disabled={isPending}>
          {isPending ? "Bajarilmoqda..." : "Blokdan chiqarish"}
        </Button>
      </div>
    </div>
  );
};

export default DriverUnblockModal;
