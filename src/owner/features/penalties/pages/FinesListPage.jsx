import { useSearchParams } from "react-router-dom";
import { Plus, AlertTriangle } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import ConfirmDialog from "@/shared/components/ui/dialog/ConfirmDialog";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { useFinesQuery } from "../hooks/useFinesQuery";
import { useFineDelete } from "../hooks/useFineMutations";
import FinesTable from "../components/FinesTable";
import FineCreateModal from "../components/modals/FineCreateModal";
import FinePayModal from "../components/modals/FinePayModal";

const FinesListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";

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
    driverId: driverIdParam || undefined,
    fromDate: date || undefined,
    toDate: date || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Jarimalar"
        description={meta.total ? `Jami ${meta.total} ta` : ""}
        actions={
          has(PERMISSIONS.FINES_CREATE) && (
            <Button
              onClick={() =>
                openModal(MODAL.FINE_CREATE, {
                  presetDriverId: driverIdParam,
                })
              }
            >
              <Plus size={16} className="mr-1.5" /> Yangi jarima
            </Button>
          )
        }
      />

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b">
        <div className="max-w-xs">
          <InputField
            label="Sana"
            type="date"
            value={date}
            onChange={(e) => setFields({ date: e.target.value, page: 1 })}
          />
        </div>
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
              : "Hozircha hech qanday jarima yozuvi yo'q"
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
        description="Jarima o'chiriladi. Depozit yoki tsikl summasi qaytariladi."
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
      <ModalWrapper name={MODAL.FINE_PAY} title="Jarimani to'lash" className="max-w-xl">
        <FinePayModal />
      </ModalWrapper>
    </div>
  );
};

export default FinesListPage;
