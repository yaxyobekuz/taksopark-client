import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import { useDailyPlanTotalQuery } from "../hooks/useReportsQuery";
import DailyTotalTable from "../components/DailyTotalTable";

const DailyPlanReportPage = () => {
  const { date, setField } = useObjectState({ date: new Date().toISOString().slice(0, 10) });
  const { data, isLoading } = useDailyPlanTotalQuery(date);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tanlangan kunda har bir mashina bo'yicha to'plangan plan va jami summa.
      </p>

      <div className="max-w-xs">
        <InputField label="Sana" type="date" value={date} onChange={(e) => setField("date", e.target.value)} />
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Yuklanmoqda...</p> : <DailyTotalTable data={data} />}
    </div>
  );
};

export default DailyPlanReportPage;
