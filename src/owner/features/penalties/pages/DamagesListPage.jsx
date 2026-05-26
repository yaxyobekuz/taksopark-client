import { useSearchParams } from "react-router-dom";
import { Plus, Wrench } from "lucide-react";

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
import { useDamagesQuery } from "../hooks/useDamagesQuery";
import { useDamageDelete } from "../hooks/useDamageMutations";
import DamagesTable from "../components/DamagesTable";
import DamageCreateModal from "../components/modals/DamageCreateModal";
import DamagePayModal from "../components/modals/DamagePayModal";

const DamagesListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";

  const { page, date, setField, setFields } = useObjectState({
    page: 1,
    date: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const damageDelete = useDamageDelete();

  const { data, isLoading } = useDamagesQuery({
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
      <div className="flex items-center justify-between sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b">
        <div className="max-w-xs">
          <InputField
            label="Sana"
            type="date"
            value={date}
            onChange={(e) => setFields({ date: e.target.value, page: 1 })}
          />
        </div>

        {has(PERMISSIONS.DAMAGES_CREATE) && (
          <Button
            onClick={() =>
              openModal(MODAL.DAMAGE_CREATE, {
                presetDriverId: driverIdParam,
              })
            }
          >
            <Plus size={16} className="mr-1.5" /> Yangi zarar
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
          icon={Wrench}
          title="Zarar yo'q"
          description={
            date
              ? "Tanlangan sanada zarar mavjud emas"
              : "Hozircha hech qanday zarar yozuvi yo'q"
          }
        />
      ) : (
        <DamagesTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper
        name={MODAL.DAMAGE_CREATE}
        title="Yangi zarar"
        className="max-w-xl"
      >
        <DamageCreateModal />
      </ModalWrapper>
      <ConfirmDialog
        name={MODAL.DAMAGE_DELETE}
        title="Zararni o'chirish"
        description="Zarar yozuvi o'chiriladi va hisob qaytadan hisoblanadi."
        confirmLabel="O'chirish"
        tone="danger"
        onConfirm={({ damage }, { close }) =>
          new Promise((resolve) => {
            if (!damage?._id) return resolve();
            damageDelete.mutate(damage._id, {
              onSuccess: () => {
                close();
                resolve();
              },
              onError: () => resolve(),
            });
          })
        }
      />
      <ModalWrapper
        name={MODAL.DAMAGE_PAY}
        title="Zararni to'lash"
        className="max-w-xl"
      >
        <DamagePayModal />
      </ModalWrapper>
    </div>
  );
};

export default DamagesListPage;
