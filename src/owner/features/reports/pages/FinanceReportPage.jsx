import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import { useCarsQuery } from "@/owner/features/cars";
import { useFinanceReportQuery } from "../hooks/useReportsQuery";
import DateRangePicker from "../components/DateRangePicker";
import FinanceMatrix from "../components/FinanceMatrix";

const monthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

const FinanceReportPage = () => {
  const { fromDate, toDate, carId, setField } = useObjectState({
    fromDate: monthAgo(),
    toDate: new Date().toISOString().slice(0, 10),
    carId: "",
  });
  const { data: carsData } = useCarsQuery({ limit: 500 });
  const carOptions = [
    { value: "", label: "Barcha mashinalar" },
    ...(carsData?.data || []).map((c) => ({ value: c._id, label: `${c.plateNumber} - ${c.model}` })),
  ];
  const { data, isLoading } = useFinanceReportQuery({ fromDate, toDate, carId: carId || undefined });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Moliyaviy hisobot</h1>
      <p className="text-sm text-muted-foreground">
        Tanlangan davr uchun har bir mashina bo'yicha daromad, jarima, zarar, oylik va sof foyda.
      </p>

      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        onChangeFrom={(v) => setField("fromDate", v)}
        onChangeTo={(v) => setField("toDate", v)}
      />
      <div className="max-w-md">
        <SelectField label="Mashina" value={carId} onChange={(v) => setField("carId", v)} options={carOptions} />
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Yuklanmoqda...</p> : <FinanceMatrix data={data} />}
    </div>
  );
};

export default FinanceReportPage;
