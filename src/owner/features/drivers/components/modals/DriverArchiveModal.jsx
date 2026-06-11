import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useDriverDelete } from "../../hooks/useDriverMutations";

const today = () => new Date().toISOString().slice(0, 10);

const DriverArchiveModal = ({ close, driver }) => {
  const [endDate, setEndDate] = useState(today());
  const { mutate, isPending } = useDriverDelete();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!driver?._id || !endDate) return;
    mutate({ id: driver._id, endDate }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center justify-center size-10 rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-gray-700 pt-1.5">
          {driver
            ? `${driver.firstName} ${driver.lastName} arxivlanadi va mashina bilan bog'lanish bekor qilinadi.`
            : "Haydovchi arxivlanadi."}
        </p>
      </div>

      <InputField
        label="Ishni tugatish sanasi"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        max={today()}
        required
        disabled={isPending}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => close()}
          disabled={isPending}
        >
          Bekor qilish
        </Button>
        <Button
          type="submit"
          variant="danger"
          className="flex-1"
          disabled={isPending || !endDate}
        >
          {isPending ? "Arxivlanmoqda..." : "Arxivlash"}
        </Button>
      </div>
    </form>
  );
};

export default DriverArchiveModal;
