import { useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useDriverEndTrial } from "../../hooks/useDriverMutations";

const toDateInput = (value) => new Date(value).toISOString().slice(0, 10);

const DriverEndTrialModal = ({ close, driver }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useDriverEndTrial();
  const isEdit = !!driver?.trialEndedAt;
  const { endDate, setField } = useObjectState({
    endDate: toDateInput(driver?.trialEndedAt || new Date()),
  });

  const handleConfirm = () => {
    if (!driver?._id) return;
    mutate(
      { id: driver._id, endDate },
      {
        onSuccess: () => {
          close();
          navigate(`/owner/drivers/${driver._id}/oyliklar`);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm">
        <span className="font-semibold">
          {driver?.firstName} {driver?.lastName}
        </span>{" "}
        haydovchining sinov tugash sanasini belgilang.
      </p>
      <InputField
        label="Sinov tugash sanasi"
        type="date"
        value={endDate}
        onChange={(e) => setField("endDate", e.target.value)}
        disabled={isPending}
      />
      <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        Shu sanadan boshlab haydovchi kunlik to'lov qilmaydi, kompaniya unga oylik
        beradi. Sinov davridagi to'lanmagan kunlar uchun keyin ham to'lov qo'shish
        mumkin.
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => close()}
          disabled={isPending}
        >
          Bekor qilish
        </Button>
        <Button className="flex-1" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Saqlanmoqda..." : isEdit ? "Sanani saqlash" : "Tugatish"}
        </Button>
      </div>
    </div>
  );
};

export default DriverEndTrialModal;
