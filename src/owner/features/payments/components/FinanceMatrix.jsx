import { formatMoney } from "@/shared/utils/formatMoney";

const FinanceMatrix = ({ data }) => {
  if (!data) return null;
  const { rows = [], totals } = data;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 rounded-lg border p-4 bg-white">
        <div>
          <p className="text-xs text-muted-foreground">Daromad</p>
          <p className="font-semibold">{formatMoney(totals?.revenue || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Jarima</p>
          <p className="font-semibold">{formatMoney(totals?.fines || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Zarar</p>
          <p className="font-semibold">{formatMoney(totals?.damages || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Oylik (ulush)</p>
          <p className="font-semibold">{formatMoney(totals?.salary || 0)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sof foyda</p>
          <p
            className={`font-semibold ${
              (totals?.profit || 0) >= 0 ? "text-primary" : "text-red-600"
            }`}
          >
            {formatMoney(totals?.profit || 0)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-3">Mashina</th>
              <th className="text-left p-3">Haydovchi</th>
              <th className="text-right p-3">Daromad</th>
              <th className="text-right p-3">Jarima</th>
              <th className="text-right p-3">Zarar</th>
              <th className="text-right p-3">Oylik</th>
              <th className="text-right p-3">Foyda</th>
            </tr>
          </thead>
          <tbody>
            {!rows.length && (
              <tr>
                <td colSpan={7} className="p-4 text-sm text-muted-foreground text-center">
                  Tanlangan davrda ma'lumot yo'q
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.carId} className="border-t">
                <td className="p-3 font-medium">{row.model || "-"} - {row.plateNumber || "-"}</td>
                <td className="p-3">{row.driver || "-"}</td>
                <td className="p-3 text-right">{formatMoney(row.revenue)}</td>
                <td className="p-3 text-right">{formatMoney(row.fines)}</td>
                <td className="p-3 text-right">{formatMoney(row.damages)}</td>
                <td className="p-3 text-right">{formatMoney(row.salary)}</td>
                <td
                  className={`p-3 text-right font-medium ${
                    row.profit >= 0 ? "text-primary" : "text-red-600"
                  }`}
                >
                  {formatMoney(row.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceMatrix;
