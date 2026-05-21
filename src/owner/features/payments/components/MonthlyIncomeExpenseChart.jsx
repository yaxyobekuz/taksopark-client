import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMoney } from "@/shared/utils/formatMoney";

// Katta sonni qisqartiradi: 1 500 000 -> "1.5 mln"
const compact = (n) => {
  const num = Number(n) || 0;
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} mln`;
  if (Math.abs(num) >= 1_000) return `${Math.round(num / 1_000)} ming`;
  return String(num);
};

const MonthlyIncomeExpenseChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  }
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">Ma'lumot yo'q</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={compact} tick={{ fontSize: 12 }} width={64} />
          <Tooltip
            formatter={(value, name) => [formatMoney(value), name]}
            labelClassName="font-medium"
          />
          <Legend />
          <Bar dataKey="income" name="Kirim" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Chiqim" fill="#dc2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyIncomeExpenseChart;
