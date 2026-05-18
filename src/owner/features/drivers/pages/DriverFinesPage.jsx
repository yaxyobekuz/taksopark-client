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
import { useFinesQuery } from "@/owner/features/penalties/hooks/useFinesQuery";
import FinesTable from "@/owner/features/penalties/components/FinesTable";
import FineCreateModal from "@/owner/features/penalties/components/modals/FineCreateModal";
import FineDeleteModal from "@/owner/features/penalties/components/modals/FineDeleteModal";
import FinePayModal from "@/owner/features/penalties/components/modals/FinePayModal";

const DriverFinesPage = () => {
  const { id } = useParams();
  const { page, date, setField } = useObjectState({ page: 1, date: "" });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const { data, isLoading } = useFinesQuery({
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
        {has(PERMISSIONS.FINES_CREATE) && (
          <Button onClick={() => openModal(MODAL.FINE_CREATE, { presetDriverId: id })}>
            <Plus size={16} className="mr-2" /> Yangi jarima
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      ) : (
        <FinesTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.FINE_CREATE} title="Yangi jarima" className="max-w-xl">
        <FineCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.FINE_DELETE} title="Jarimani o'chirish">
        <FineDeleteModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.FINE_PAY} title="Jarimani to'lash" className="max-w-xl">
        <FinePayModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverFinesPage;
