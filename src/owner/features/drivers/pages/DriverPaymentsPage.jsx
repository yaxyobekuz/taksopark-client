import { useOutletContext, useParams } from "react-router-dom";
import { Plus, BadgeDollarSign } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import ConfirmDialog from "@/shared/components/ui/dialog/ConfirmDialog";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";
import DetailSection from "@/shared/components/ui/layout/DetailSection";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { TARIFFS } from "@/shared/constants/tariffs";
import { usePaymentsQuery } from "@/owner/features/payments";
import { usePaymentDelete } from "@/owner/features/payments/hooks/usePaymentMutations";
import PaymentsTable from "@/owner/features/payments/components/PaymentsTable";
import PaymentCreateModal from "@/owner/features/payments/components/modals/PaymentCreateModal";
import PaymentEditModal from "@/owner/features/payments/components/modals/PaymentEditModal";
import DriverMonthlyProgressCard from "../components/DriverMonthlyProgressCard";

const DriverPaymentsPage = () => {
  const { id } = useParams();
  const { driver } = useOutletContext();
  const { page, date, setField, setFields } = useObjectState({
    page: 1,
    date: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const paymentDelete = usePaymentDelete();

  const { data, isLoading } = usePaymentsQuery({
    page,
    limit: 20,
    driverId: id,
    fromDate: date || undefined,
    toDate: date || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      {driver.tariff === TARIFFS.DEPOSIT && (
        <DetailSection title="Oylik to'lov progressi" defaultOpen>
          <DriverMonthlyProgressCard driverId={id} />
        </DetailSection>
      )}

      <div className="flex items-end justify-between gap-4">
        <div className="max-w-xs flex-1">
          <InputField
            label="Sana"
            type="date"
            value={date}
            onChange={(e) => setFields({ date: e.target.value, page: 1 })}
          />
        </div>
        {has(PERMISSIONS.PAYMENTS_CREATE) && (
          <Button
            onClick={() =>
              openModal(MODAL.PAYMENT_CREATE, { presetDriverId: id })
            }
          >
            <Plus size={16} className="mr-1.5" /> Yangi to'lov
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRow count={5} columns={5} />
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={BadgeDollarSign}
          title="To'lov yo'q"
          description={
            date
              ? "Tanlangan sanada to'lov mavjud emas"
              : "Bu haydovchining to'lovlari hozircha yo'q"
          }
        />
      ) : (
        <PaymentsTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.PAYMENT_CREATE} title="Yangi to'lov">
        <PaymentCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.PAYMENT_EDIT} title="To'lovni tahrirlash">
        <PaymentEditModal />
      </ModalWrapper>
      <ConfirmDialog
        name={MODAL.PAYMENT_DELETE}
        title="To'lovni o'chirish"
        description="To'lov o'chiriladi va hisob qaytadan hisoblanadi."
        confirmLabel="O'chirish"
        tone="danger"
        onConfirm={({ payment }, { close }) =>
          new Promise((resolve) => {
            if (!payment?._id) return resolve();
            paymentDelete.mutate(payment._id, {
              onSuccess: () => {
                close();
                resolve();
              },
              onError: () => resolve(),
            });
          })
        }
      />
    </div>
  );
};

export default DriverPaymentsPage;
