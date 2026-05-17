import { PAYMENT_STATUS, PAYMENT_STATUS_LABELS } from "@/shared/constants/payments";
import { formatMoney } from "@/shared/utils/formatMoney";

const COLORS = {
  [PAYMENT_STATUS.PENDING]: "bg-gray-100 text-gray-700 border-gray-200",
  [PAYMENT_STATUS.PARTIAL]: "bg-amber-100 text-amber-700 border-amber-200",
  [PAYMENT_STATUS.PAID]: "bg-green-100 text-green-700 border-green-200",
};

const PaymentStatusBadge = ({ status, paidAmount, amount }) => {
  const color = COLORS[status] || COLORS[PAYMENT_STATUS.PENDING];
  const label = PAYMENT_STATUS_LABELS[status] || status;
  return (
    <span className={`inline-flex flex-col gap-0.5 px-2 py-1 text-xs rounded-md border ${color}`}>
      <span className="font-medium">{label}</span>
      {status === PAYMENT_STATUS.PARTIAL && (
        <span className="text-[10px] opacity-80">{formatMoney(paidAmount)} / {formatMoney(amount)}</span>
      )}
    </span>
  );
};

export default PaymentStatusBadge;
