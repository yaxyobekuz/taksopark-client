import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";

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

export default CategoryList;
