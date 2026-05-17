import { formatMoney } from "@/shared/utils/formatMoney";

const DailyTotalTable = ({ data }) => {
  if (!data) return null;
  const { perCar = [], totalAmount, totalExpected } = data;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 rounded-lg border p-4 bg-white">
        <div>
          <p className="text-xs text-muted-foreground">Jami yig'ilgan</p>
          <p className="text-xl font-semibold text-primary">
            {formatMoney(totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Jami kutilgan reja</p>
          <p className="text-xl font-semibold">{formatMoney(totalExpected)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-3">Mashina</th>
              <th className="text-left p-3">Haydovchi</th>
              <th className="text-right p-3">Kutilgan</th>
              <th className="text-right p-3">To'plangan</th>
              <th className="text-right p-3">Qolgan</th>
            </tr>
          </thead>
          <tbody>
            {!perCar.length && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-sm text-muted-foreground text-center"
                >
                  Bu kun uchun to'lov yo'q
                </td>
              </tr>
            )}
            {perCar.map((row) => {
              const deficit = Math.max(0, row.expected - row.amount);
              return (
                <tr key={row.carId} className="border-t">
                  <td className="p-3">
                    {row.model || "-"} - {row.plateNumber || "-"}
                  </td>
                  <td className="p-3">{row.driverName || "-"}</td>
                  <td className="p-3 text-right text-muted-foreground">
                    {formatMoney(row.expected)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatMoney(row.amount)}
                  </td>
                  <td
                    className={`p-3 text-right ${deficit > 0 ? "text-red-600" : ""}`}
                  >
                    {deficit > 0 ? formatMoney(deficit) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyTotalTable;
