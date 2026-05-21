import { Trash2 } from "lucide-react";
import usePermissions from "@/shared/hooks/usePermissions";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useOylikPayoutDelete } from "../hooks/useOylikPayoutMutations";

const PayoutsList = ({ oylikId, payouts = [], canDelete = true }) => {
  const { has } = usePermissions();
  const { mutate, isPending } = useOylikPayoutDelete();

  if (!payouts.length) {
    return <p className="text-sm text-muted-foreground">Hali to'lov yo'q</p>;
  }

  return (
    <div className="space-y-1">
      {payouts.map((p) => (
        <div
          key={p._id}
          className="flex items-center justify-between rounded border p-2 text-sm"
        >
          <div className="flex flex-col">
            <span className="font-medium">{formatMoney(p.amount)}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(p.paidAt).toLocaleDateString("uz-UZ")}
              {p.note ? ` - ${p.note}` : ""}
            </span>
          </div>
          {canDelete && has(PERMISSIONS.OYLIKLAR_PAYOUT) && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("To'lovni o'chirishni tasdiqlaysizmi?")) {
                  mutate({ id: oylikId, payoutId: p._id });
                }
              }}
              className="text-muted-foreground hover:text-red-600"
              disabled={isPending}
              title="O'chirish"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PayoutsList;
