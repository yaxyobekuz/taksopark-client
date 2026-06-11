import { useParams } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";

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

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { useFinesQuery } from "@/owner/features/penalties/hooks/useFinesQuery";
import { useFineDelete } from "@/owner/features/penalties/hooks/useFineMutations";
import FinesTable from "@/owner/features/penalties/components/FinesTable";
import FineCreateModal from "@/owner/features/penalties/components/modals/FineCreateModal";

const DriverFinesPage = () => {
  const { id } = useParams();
  const { page, date, setField, setFields } = useObjectState({
    page: 1,
    date: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const fineDelete = useFineDelete();

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
            onChange={(e) => setFields({ date: e.target.value, page: 1 })}
          />
        </div>
        {has(PERMISSIONS.FINES_CREATE) && (
          <Button
            onClick={() =>
              openModal(MODAL.FINE_CREATE, { presetDriverId: id })
            }
          >
            <Plus size={16} className="mr-1.5" /> Yangi jarima
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
          icon={AlertTriangle}
          title="Jarima yo'q"
          description={
            date
              ? "Tanlangan sanada jarima mavjud emas"
              : "Bu haydovchining jarimalari hozircha yo'q"
          }
        />
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
      <ConfirmDialog
        name={MODAL.FINE_DELETE}
        title="Jarimani o'chirish"
        description="Jarima o'chiriladi. Davom etishni xohlaysizmi?"
        confirmLabel="O'chirish"
        tone="danger"
        onConfirm={({ fine }, { close }) =>
          new Promise((resolve) => {
            if (!fine?._id) return resolve();
            fineDelete.mutate(fine._id, {
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

export default DriverFinesPage;
