import InputField from "@/shared/components/ui/input/InputField";

const DateRangePicker = ({ fromDate, toDate, onChangeFrom, onChangeTo, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${className}`}>
      <InputField label="Dan" type="date" value={fromDate} onChange={(e) => onChangeFrom(e.target.value)} />
      <InputField label="Gacha" type="date" value={toDate} onChange={(e) => onChangeTo(e.target.value)} />
    </div>
  );
};

export default DateRangePicker;
