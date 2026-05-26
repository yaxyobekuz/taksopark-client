import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMoney } from "@/shared/utils/formatMoney";

const compact = (n) => {
  const num = Number(n) || 0;
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} mln`;
  if (Math.abs(num) >= 1_000) return `${Math.round(num / 1_000)} ming`;
  return String(num);
};

const DailyIncomeExpenseChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  }
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">Ma'lumot yo'q</p>;
  }

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" hide />
          <YAxis tickFormatter={compact} tick={{ fontSize: 12 }} width={64} />
          <Tooltip
            formatter={(value, name) => [formatMoney(value), name]}
            labelClassName="font-medium"
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Kirim"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Chiqim"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyIncomeExpenseChart;
