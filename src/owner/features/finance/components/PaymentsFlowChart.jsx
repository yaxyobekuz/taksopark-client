import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { formatMoney } from "@/shared/utils/formatMoney";

// Katta summalarni qisqa ko'rsatish (o'q belgilarida): 80 000 -> "80k", 1 200 000 -> "1.2M".
const compact = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
};

// Kunlik to'lov kirim (to'lov) va chiqim (reversal) — kun bo'yicha line chart.
const PaymentsFlowChart = ({ series = [] }) => {
  const data = series.map((d) => ({
    day: d.day,
    Kirim: d.income,
    Chiqim: d.expense,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={compact}
            width={44}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value) => formatMoney(value)}
            labelFormatter={(day) => `${day}-kun`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Kirim" stroke="#16a34a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Chiqim" stroke="#dc2626" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentsFlowChart;
