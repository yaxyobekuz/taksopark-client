import { Plus, Car as CarIcon } from "lucide-react";

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
import { useCarsQuery } from "../hooks/useCarsQuery";
import { useCarDelete } from "../hooks/useCarMutations";
import CarsTable from "../components/CarsTable";
import CarCreateModal from "../components/modals/CarCreateModal";
import CarEditModal from "../components/modals/CarEditModal";

const CarsListPage = () => {
  const { page, search, setField, setFields } = useObjectState({
    page: 1,
    search: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const carDelete = useCarDelete();

  const { data, isLoading } = useCarsQuery({
    page,
    limit: 20,
    search: search || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mashinalar"
        description={meta.total ? `Jami ${meta.total} ta` : ""}
        actions={
          has(PERMISSIONS.CARS_CREATE) && (
            <Button onClick={() => openModal(MODAL.CAR_CREATE)}>
              <Plus size={16} className="mr-1.5" /> Yangi mashina
            </Button>
          )
        }
      />

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b">
        <InputField
          type="search"
          placeholder="Qidirish (raqam, model, VIN)..."
          value={search}
          onChange={(e) => setFields({ search: e.target.value, page: 1 })}
        />
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
          icon={CarIcon}
          title="Mashina topilmadi"
          description={
            search
              ? "Boshqa qidiruv so'zini sinab ko'ring"
              : "Birinchi mashinani qo'shing"
          }
          action={
            has(PERMISSIONS.CARS_CREATE) && !search ? (
              <Button onClick={() => openModal(MODAL.CAR_CREATE)}>
                <Plus size={16} className="mr-1.5" /> Yangi mashina
              </Button>
            ) : null
          }
        />
      ) : (
        <CarsTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.CAR_CREATE} title="Yangi mashina qo'shish">
        <CarCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_EDIT} title="Mashinani tahrirlash">
        <CarEditModal />
      </ModalWrapper>
      <ConfirmDialog
        name={MODAL.CAR_DELETE}
        title="Mashinani o'chirish"
        description="Mashina arxivlanadi. Davom etishni xohlaysizmi?"
        confirmLabel="O'chirish"
        tone="danger"
        onConfirm={({ car }, { close }) =>
          new Promise((resolve) => {
            if (!car?._id) return resolve();
            carDelete.mutate(car._id, {
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

export default CarsListPage;
