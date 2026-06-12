import { useOutletContext } from "react-router-dom";
import { Plus, CircleDollarSign } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import ConfirmDialog from "@/shared/components/ui/dialog/ConfirmDialog";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { useCarPricesQuery } from "../hooks/useCarPricesQuery";
import { useCarPriceDelete } from "../hooks/useCarPriceMutations";
import CarPriceStats from "../components/CarPriceStats";
import CarPricesTable from "../components/CarPricesTable";
import CarPriceFormModal from "../components/modals/CarPriceFormModal";

const CarPricesPage = () => {
  const { car } = useOutletContext();
  const carId = car._id;
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.CAR_PRICES_MANAGE);

  const { data: periods = [], isLoading } = useCarPricesQuery(carId);
  const priceDelete = useCarPriceDelete(carId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">Narx davrlari</h2>
        {canManage && (
          <Button onClick={() => openModal(MODAL.CAR_PRICE_FORM, { carId })}>
            <Plus size={16} className="mr-1.5" /> Yangi narx davri
          </Button>
        )}
      </div>

      <CarPriceStats periods={periods} />

      {isLoading ? (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRow count={4} columns={7} />
            </tbody>
          </table>
        </div>
      ) : periods.length === 0 ? (
        <EmptyState
          icon={CircleDollarSign}
          title="Narx davri yo'q"
          description="Bu mashina uchun hozircha narx davri belgilanmagan"
        />
      ) : (
        <CarPricesTable items={periods} />
      )}

      <ModalWrapper name={MODAL.CAR_PRICE_FORM} title="Narx davri" className="max-w-xl">
        <CarPriceFormModal />
      </ModalWrapper>
      <ConfirmDialog
        name={MODAL.CAR_PRICE_DELETE}
        title="Narx davrini o'chirish"
        description="Narx davri o'chiriladi. Davom etishni xohlaysizmi?"
        confirmLabel="O'chirish"
        tone="danger"
        onConfirm={({ period }, { close }) =>
          new Promise((resolve) => {
            if (!period?._id) return resolve();
            priceDelete.mutate(period._id, {
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

export default CarPricesPage;
