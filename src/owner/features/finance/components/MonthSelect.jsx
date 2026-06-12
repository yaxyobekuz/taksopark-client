import SelectField from "@/shared/components/ui/select/SelectField";
import { months as MONTHS } from "@/shared/utils/date.utils";

// Yil/oy tanlovchi - moliya sahifalarida umumiy ishlatiladi.
const MonthSelect = ({ year, month, onChange }) => {
  const now = new Date();
  const yearOptions = [];
  for (let y = now.getFullYear() - 3; y <= now.getFullYear(); y += 1) {
    yearOptions.push({ value: String(y), label: String(y) });
  }
  const monthOptions = MONTHS.map((m) => ({ value: String(m.value + 1), label: m.label }));

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-32">
        <SelectField
          label="Yil"
          value={String(year)}
          onChange={(v) => onChange({ year: Number(v), month })}
          options={yearOptions}
        />
      </div>
      <div className="w-40">
        <SelectField
          label="Oy"
          value={String(month)}
          onChange={(v) => onChange({ year, month: Number(v) })}
          options={monthOptions}
        />
      </div>
    </div>
  );
};

export default MonthSelect;
