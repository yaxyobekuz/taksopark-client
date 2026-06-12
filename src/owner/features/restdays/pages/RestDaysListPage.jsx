import { Plus, CalendarOff } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import ConfirmDialog from "@/shared/components/ui/dialog/ConfirmDialog";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { useDriversQuery } from "@/owner/features/drivers";

import { useRestdaysQuery } from "../hooks/useRestdaysQuery";
import { useRestdayDelete } from "../hooks/useRestdayMutations";
import RestDaysTable from "../components/RestDaysTable";
import RestDayCreateModal from "../components/modals/RestDayCreateModal";

const RestDaysListPage = () => {
  const { page, date, driverId, setField, setFields } = useObjectState({
    page: 1,
    date: "",
    driverId: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const restDayDelete = useRestdayDelete();

  const { data: driversData } = useDriversQuery({ limit: 500, status: "working" });
  const drivers = driversData?.data || [];
  const driverOptions = [
    { value: "", label: "Barcha haydovchilar" },
    ...drivers.map((d) => ({
      value: d._id,
      label: `${d.firstName} ${d.lastName}`,
    })),
  ];

  const { data, isLoading } = useRestdaysQuery({
    page,
    limit: 20,
    driverId: driverId || undefined,
    fromDate: date || undefined,
    toDate: date || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <SelectField
              label="Haydovchi"
              value={driverId}
              onChange={(v) => setFields({ driverId: v, page: 1 })}
              options={driverOptions}
              searchable
            />
          </div>
          <div className="max-w-xs">
            <InputField
              label="Sana"
              type="date"
              value={date}
              onChange={(e) => setFields({ date: e.target.value, page: 1 })}
            />
          </div>
        </div>

        {has(PERMISSIONS.REST_DAYS_MANAGE) && (
          <Button onClick={() => openModal(MODAL.REST_DAY_CREATE, {})}>
            <Plus /> Yangi dam olish kuni
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRow count={5} columns={4} />
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={CalendarOff}
          title="Dam olish kuni yo'q"
          description={
            date || driverId
              ? "Tanlangan filtrlar bo'yicha dam olish kuni mavjud emas"
              : "Hozircha hech qanday dam olish kuni belgilanmagan"
          }
        />
      ) : (
        <RestDaysTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.REST_DAY_CREATE} title="Yangi dam olish kuni">
        <RestDayCreateModal />
      </ModalWrapper>
      <ConfirmDialog
        name={MODAL.REST_DAY_DELETE}
        title="Ish kuniga qaytarish"
        description="Bu kun dam olish kunidan oddiy ish kuniga aylantiriladi."
        confirmLabel="Qaytarish"
        tone="danger"
        onConfirm={({ restDay }, { close }) =>
          new Promise((resolve) => {
            if (!restDay?._id) return resolve();
            restDayDelete.mutate(restDay._id, {
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

export default RestDaysListPage;
