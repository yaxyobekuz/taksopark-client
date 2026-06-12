import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { TARIFF, TARIFF_OPTIONS } from "@/shared/constants/tariffs";
import { dayKey } from "../../utils/workPeriod.utils";
import {
  useWorkPeriodCreate,
  useWorkPeriodUpdate,
} from "../../hooks/useWorkPeriodMutations";

const WorkPeriodFormModal = ({ close, driverId, period }) => {
  const isEdit = !!period?._id;

  const { tariff, startDate, endDate, note, setField, state } = useObjectState({
    tariff: period?.tariff || TARIFF.DEPOSIT,
    startDate: period?.startDate ? dayKey(period.startDate) : new Date().toISOString().slice(0, 10),
    endDate: period?.endDate ? dayKey(period.endDate) : "",
    note: period?.note || "",
  });

  const create = useWorkPeriodCreate(driverId);
  const update = useWorkPeriodUpdate(driverId);
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tariff || !startDate) return;
    const payload = {
      tariff: state.tariff,
      startDate: state.startDate,
      endDate: state.endDate || null,
      note: state.note,
    };
    if (isEdit) {
      update.mutate({ id: period._id, ...payload }, { onSuccess: () => close() });
    } else {
      create.mutate({ driverId, ...payload }, { onSuccess: () => close() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Tarif"
        value={tariff}
        onChange={(v) => setField("tariff", v)}
        options={TARIFF_OPTIONS}
        disabled={isPending}
      />
      <InputField
        label="Boshlanish sanasi"
        type="date"
        value={startDate}
        onChange={(e) => setField("startDate", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Tugash sanasi"
        type="date"
        value={endDate}
        onChange={(e) => setField("endDate", e.target.value)}
        description="Bo'sh qoldirilsa - davr ochiq (haydovchi hozir shu tarifda ishlayapti)"
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={note}
        onChange={(e) => setField("note", e.target.value)}
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default WorkPeriodFormModal;
