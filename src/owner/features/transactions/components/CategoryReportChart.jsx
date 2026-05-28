import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";

const INCOME_COLORS = ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#15803d", "#bbf7d0"];
const EXPENSE_COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#b91c1c", "#fecaca"];

const CategoryReportChart = ({ title, rows = [], total, tone }) => {
  const colors = tone === "positive" ? INCOME_COLORS : EXPENSE_COLORS;
  const valueColor = tone === "positive" ? "text-green-700" : "text-red-700";

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className={`text-sm font-semibold ${valueColor}`}>
          {formatMoney(total)}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">Ma'lumot yo'q</p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="amount"
                nameKey="category"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {rows.map((r, i) => (
                  <Cell key={r.category} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [formatMoney(value), name]} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default CategoryReportChart;
