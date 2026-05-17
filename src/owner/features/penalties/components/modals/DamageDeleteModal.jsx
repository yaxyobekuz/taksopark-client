import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useDamageDelete } from "../../hooks/useDamageMutations";

const DamageDeleteModal = ({ close, damage }) => {
  const { mutate, isPending } = useDamageDelete();
  const handleDelete = () => {
    if (!damage?._id) return;
    mutate(damage._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{formatMoney(damage?.amount)}</span> zararini o'chirmoqchimisiz?
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

export default DamageDeleteModal;
