import { Trash2, Pencil } from "lucide-react";
import usePermissions from "@/shared/hooks/usePermissions";
import useModal from "@/shared/hooks/useModal";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useOylikPayoutDelete } from "../hooks/useOylikPayoutMutations";

const PayoutsList = ({ oylikId, payouts = [], canManage = true }) => {
  const { has } = usePermissions();
  const { openModal } = useModal();
  const { mutate, isPending } = useOylikPayoutDelete();

  if (!payouts.length) {
    return <p className="text-sm text-muted-foreground">Hali to'lov yo'q</p>;
  }

  const canEdit = canManage && has(PERMISSIONS.OYLIKLAR_PAYOUT);

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
          {canEdit && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openModal(MODAL.OYLIK_PAYOUT_EDIT, { oylikId, payout: p })}
                className="text-muted-foreground hover:text-primary"
                disabled={isPending}
                title="Tahrirlash"
              >
                <Pencil size={14} />
              </button>
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PayoutsList;
