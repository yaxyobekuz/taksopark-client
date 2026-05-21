import { AlertTriangle } from "lucide-react";

const LABELS = {
  deposit_low: "Depoziti tugamoqda",
  deposit_empty: "Depoziti tugagan",
  debtor: "Qarzdor",
  no_payment_2_days: "2 kundan ko'p to'lov yo'q",
  oylik_late: "Oylik muddati o'tgan",
};

const COLORS = {
  deposit_low: "bg-amber-100 text-amber-700 border-amber-200",
  deposit_empty: "bg-red-100 text-red-700 border-red-200",
  debtor: "bg-red-100 text-red-700 border-red-200",
  no_payment_2_days: "bg-orange-100 text-orange-700 border-orange-200",
  oylik_late: "bg-red-100 text-red-700 border-red-200",
};

const WarningBadge = ({ code }) => {
  const label = LABELS[code] || code;
  const color = COLORS[code] || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md border ${color}`}>
      <AlertTriangle size={12} />
      {label}
    </span>
  );
};

export default WarningBadge;
