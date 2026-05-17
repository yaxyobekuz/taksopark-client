import { Trash2, Wallet } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { PAYMENT_STATUS } from "@/shared/constants/payments";
import { formatMoney } from "@/shared/utils/formatMoney";
import PaymentStatusBadge from "@/shared/components/ui/badge/PaymentStatusBadge";
import AttachmentPreview from "./AttachmentPreview";

const FinesTable = ({ items = [] }) => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) return <p className="text-sm text-muted-foreground p-4">Jarima yo'q</p>;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-3">Sana</th>
            <th className="text-left p-3">Haydovchi</th>
            <th className="text-left p-3">Mashina</th>
            <th className="text-right p-3">Summa</th>
            <th className="text-left p-3">Holat</th>
            <th className="text-left p-3">Hujjat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((f) => (
            <tr key={f._id} className="border-t align-top">
              <td className="p-3">{new Date(f.issueDate).toLocaleDateString("uz-UZ")}</td>
              <td className="p-3">{f.driver ? `${f.driver.firstName} ${f.driver.lastName}` : "-"}</td>
              <td className="p-3">{f.car?.plateNumber || "-"}</td>
              <td className="p-3 text-right font-medium">{formatMoney(f.amount)}</td>
              <td className="p-3">
                <PaymentStatusBadge status={f.paymentStatus} paidAmount={f.paidAmount} amount={f.amount} />
              </td>
              <td className="p-3">
                <AttachmentPreview attachments={f.attachments} />
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {has(PERMISSIONS.FINES_PAY) && f.paymentStatus !== PAYMENT_STATUS.PAID && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.FINE_PAY, { fine: f })}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      title="To'lash"
                    >
                      <Wallet size={14} /> To'lash
                    </button>
                  )}
                  {has(PERMISSIONS.FINES_PAY) && f.paymentStatus === PAYMENT_STATUS.PAID && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.FINE_PAY, { fine: f })}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      title="To'lovlar"
                    >
                      <Wallet size={14} /> Ko'rish
                    </button>
                  )}
                  {has(PERMISSIONS.FINES_DELETE) && (
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.FINE_DELETE, { fine: f })}
                      className="text-muted-foreground hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinesTable;
