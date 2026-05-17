import { useState } from "react";
import Button from "@/shared/components/ui/button/Button";
import { useDriverBlock } from "../../hooks/useDriverMutations";

const DriverBlockModal = ({ close, driver }) => {
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useDriverBlock();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver?._id || !reason.trim()) return;
    mutate({ id: driver._id, reason: reason.trim() }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">{driver?.firstName} {driver?.lastName}</span> ni
        bloklash sababini kiriting.
      </p>
      <textarea
        className="w-full min-h-[100px] p-2 border rounded-md text-sm"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Masalan: 2 kundan ortiq to'lov yo'q"
        disabled={isPending}
        required
      />
      <div className="flex gap-2">
        <Button variant="outline" type="button" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button variant="danger" type="submit" className="flex-1" disabled={isPending || !reason.trim()}>
          {isPending ? "Bloklanmoqda..." : "Bloklash"}
        </Button>
      </div>
    </form>
  );
};

export default DriverBlockModal;
