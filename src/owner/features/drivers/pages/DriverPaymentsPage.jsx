import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { usePaymentsQuery } from "@/owner/features/payments";
import PaymentsTable from "@/owner/features/payments/components/PaymentsTable";
import PaymentCreateModal from "@/owner/features/payments/components/modals/PaymentCreateModal";
import PaymentEditModal from "@/owner/features/payments/components/modals/PaymentEditModal";
import PaymentDeleteModal from "@/owner/features/payments/components/modals/PaymentDeleteModal";

const DriverPaymentsPage = () => {
  const { id } = useParams();
  const { page, date, setField } = useObjectState({ page: 1, date: "" });
  const { openModal } = useModal();
  const { has } = usePermissions();

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
      <div className="flex items-end justify-between gap-4">
        <div className="max-w-xs flex-1">
          <InputField
            label="Sana"
            type="date"
            value={date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </div>
        {has(PERMISSIONS.PAYMENTS_CREATE) && (
          <Button onClick={() => openModal(MODAL.PAYMENT_CREATE, { presetDriverId: id })}>
            <Plus size={16} className="mr-2" /> Yangi to'lov
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
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
      <ModalWrapper name={MODAL.PAYMENT_DELETE} title="To'lovni o'chirish">
        <PaymentDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverPaymentsPage;
