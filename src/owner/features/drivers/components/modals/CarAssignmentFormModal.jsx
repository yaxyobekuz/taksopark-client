import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { useCarsQuery } from "@/owner/features/cars";
import { dayKey } from "../../utils/workPeriod.utils";
import {
  useCarAssignmentCreate,
  useCarAssignmentUpdate,
} from "../../hooks/useCarAssignmentMutations";

const CarAssignmentFormModal = ({ close, driverId, assignment }) => {
  const isEdit = !!assignment?._id;
  const currentCarId = assignment?.car?._id || assignment?.car || "";

  const { carId, startDate, endDate, note, setField, state } = useObjectState({
    carId: currentCarId,
    startDate: assignment?.startDate ? dayKey(assignment.startDate) : new Date().toISOString().slice(0, 10),
    endDate: assignment?.endDate ? dayKey(assignment.endDate) : "",
    note: assignment?.note || "",
  });

  const { data: carsData } = useCarsQuery({ limit: 500, isActive: "true" });
  const carOptions = (carsData?.data || []).map((c) => ({
    value: c._id,
    label: `${c.plateNumber || "-"} - ${c.model}`,
  }));

  const create = useCarAssignmentCreate(driverId);
  const update = useCarAssignmentUpdate(driverId);
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!carId || !startDate) return;
    const payload = {
      carId: state.carId,
      startDate: state.startDate,
      endDate: state.endDate || null,
      note: state.note,
    };
    if (isEdit) {
      update.mutate({ id: assignment._id, ...payload }, { onSuccess: () => close() });
    } else {
      create.mutate({ driverId, ...payload }, { onSuccess: () => close() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Mashina"
        value={carId}
        onChange={(v) => setField("carId", v)}
        options={[{ value: "", label: "- Mashinani tanlang -" }, ...carOptions]}
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
        description="Bo'sh qoldirilsa - biriktirish ochiq (haydovchi hozir shu mashinada)"
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
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default CarAssignmentFormModal;
