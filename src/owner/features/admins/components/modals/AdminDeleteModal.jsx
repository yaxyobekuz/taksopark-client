import Button from "@/shared/components/ui/button/Button";
import { useAdminDelete } from "../../hooks/useAdminMutations";

const AdminDeleteModal = ({ close, admin, onDeleted }) => {
  const { mutate, isPending } = useAdminDelete();

  const handleConfirm = () => {
    if (!admin?._id) return;
    mutate(admin._id, {
      onSuccess: () => {
        close();
        onDeleted?.();
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{admin?.username}</span> adminni o'chirmoqchimisiz?
      </p>
      <p className="text-xs text-muted-foreground">
        Bu amalni qaytarib bo'lmaydi.
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="button" className="flex-1" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "O'chirilmoqda..." : "O'chirish"}
        </Button>
      </div>
    </div>
  );
};

export default AdminDeleteModal;
