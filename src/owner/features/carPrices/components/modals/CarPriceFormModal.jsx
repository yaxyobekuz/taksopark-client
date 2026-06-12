import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { dayKey } from "../../utils/carPrice.utils";
import {
  useCarPriceCreate,
  useCarPriceUpdate,
} from "../../hooks/useCarPriceMutations";

const numStr = (v) => (v != null && v !== "" ? String(v) : "");

const CarPriceFormModal = ({ close, carId, period }) => {
  const isEdit = !!period?._id;

  const {
    dailyRateDeposit,
    dailyRateCashback,
    monthlyCashback,
    startDate,
    endDate,
    note,
    setField,
    state,
  } = useObjectState({
    dailyRateDeposit: numStr(period?.dailyRateDeposit),
    dailyRateCashback: numStr(period?.dailyRateCashback),
    monthlyCashback: numStr(period?.monthlyCashback),
    startDate: period?.startDate
      ? dayKey(period.startDate)
      : new Date().toISOString().slice(0, 10),
    endDate: period?.endDate ? dayKey(period.endDate) : "",
    note: period?.note || "",
  });

  const create = useCarPriceCreate(carId);
  const update = useCarPriceUpdate(carId);
  const isPending = create.isPending || update.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || dailyRateDeposit === "" || dailyRateCashback === "") return;
    const payload = {
      dailyRateDeposit: Number(state.dailyRateDeposit) || 0,
      dailyRateCashback: Number(state.dailyRateCashback) || 0,
      monthlyCashback: Number(state.monthlyCashback) || 0,
      startDate: state.startDate,
      endDate: state.endDate || null,
      note: state.note,
    };
    if (isEdit) {
      update.mutate({ id: period._id, ...payload }, { onSuccess: () => close() });
    } else {
      create.mutate({ carId, ...payload }, { onSuccess: () => close() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Depozitli tarif - kunlik narx (so'm)"
          type="price"
          value={dailyRateDeposit}
          onChange={(e) => setField("dailyRateDeposit", e.target.value)}
          required
          disabled={isPending}
        />
        <InputField
          label="Keshbekli tarif - kunlik narx (so'm)"
          type="price"
          value={dailyRateCashback}
          onChange={(e) => setField("dailyRateCashback", e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <InputField
        label="Oylik keshbek narxi (so'm)"
        type="price"
        value={monthlyCashback}
        onChange={(e) => setField("monthlyCashback", e.target.value)}
        description="Keshbekli tarifdagi haydovchiga har oy qaytariladigan summa"
        disabled={isPending}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          description="Bo'sh qoldirilsa - davr ochiq (hozir amaldagi narx)"
          disabled={isPending}
        />
      </div>
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

export default CarPriceFormModal;
