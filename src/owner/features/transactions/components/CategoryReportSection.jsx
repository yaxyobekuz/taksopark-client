import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useCategoryReportQuery } from "../hooks/useTransactions";

const CategoryList = ({ title, rows = [], total, tone }) => {
  const valueColor = tone === "positive" ? "text-green-700" : "text-red-700";
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className={`text-sm font-semibold ${valueColor}`}>{formatMoney(total)}</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">Ma'lumot yo'q</p>
      ) : (
        <div className="divide-y">
          {rows.map((r) => {
            const percent = total > 0 ? Math.round((r.amount / total) * 100) : 0;
            return (
              <div key={r.category} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.category}</p>
                  <p className="text-xs text-muted-foreground">{percent}% · {r.count} ta</p>
                </div>
                <span className={`text-sm font-medium shrink-0 ${valueColor}`}>{formatMoney(r.amount)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

const CategoryReportSection = ({ fromDate, toDate }) => {
  const { data, isLoading } = useCategoryReportQuery({ fromDate, toDate });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Hisobot yuklanmoqda...</p>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Kategoriya bo'yicha hisobot</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <CategoryList
          title="Kirim"
          rows={data?.income || []}
          total={data?.totalIncome || 0}
          tone="positive"
        />
        <CategoryList
          title="Chiqim"
          rows={data?.expense || []}
          total={data?.totalExpense || 0}
          tone="negative"
        />
      </div>
    </div>
  );
};

export default CategoryReportSection;
