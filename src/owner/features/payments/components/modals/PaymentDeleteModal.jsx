import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { usePaymentDelete } from "../../hooks/usePaymentMutations";

const PaymentDeleteModal = ({ close, payment }) => {
  const { mutate, isPending } = usePaymentDelete();
  const handleDelete = () => {
    if (!payment?._id) return;
    mutate(payment._id, { onSuccess: () => close() });
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{formatMoney(payment?.amount)}</span> to'lovini o'chirmoqchimisiz?
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

export default PaymentDeleteModal;
