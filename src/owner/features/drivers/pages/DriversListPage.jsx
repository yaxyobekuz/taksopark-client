import { Plus, Users } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { useIsMobile } from "@/shared/hooks/useMobile";

import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import TabsButtons from "@/shared/components/ui/tabs/TabsButtons";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import FilterChips from "@/shared/components/ui/data/FilterChips";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  DRIVER_WORK_STATUS,
  DRIVER_STATUS_TABS,
  DRIVER_STATUS_TAB_ALL,
} from "@/shared/constants/drivers";

import { useDriversQuery } from "../hooks/useDriversQuery";
import DriversTable from "../components/DriversTable";
import DriverCard from "../components/DriverCard";
import DriverCreateModal from "../components/modals/DriverCreateModal";
import DriverEditModal from "../components/modals/DriverEditModal";

const DriversListPage = () => {
  const { page, search, status, setField, setFields } = useObjectState({
    page: 1,
    search: "",
    status: DRIVER_WORK_STATUS.WORKING,
  });
  const { openModal } = useModal();
  const { has } = usePermissions();
  const isMobile = useIsMobile();

  const { data, isLoading } = useDriversQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: status === DRIVER_STATUS_TAB_ALL ? undefined : status,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  const chips = [
    search && {
      key: "search",
      label: `Qidiruv: "${search}"`,
      onRemove: () => setFields({ search: "", page: 1 }),
    },
  ].filter(Boolean);

  const hasFilters = chips.length > 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Haydovchilar"
        description={meta.total ? `Jami ${meta.total} ta` : ""}
        actions={
          has(PERMISSIONS.DRIVERS_CREATE) && (
            <Button onClick={() => openModal(MODAL.DRIVER_CREATE)}>
              <Plus size={16} className="mr-1.5" /> Yangi haydovchi
            </Button>
          )
        }
      />

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-3 bg-background border-b space-y-2">
        <TabsButtons
          items={DRIVER_STATUS_TABS}
          value={status}
          onChange={(v) => setFields({ status: v, page: 1 })}
        />
        <InputField
          type="search"
          placeholder="Qidirish (ism, telefon)..."
          value={search}
          onChange={(e) => setFields({ search: e.target.value, page: 1 })}
        />
        {hasFilters && (
          <FilterChips
            items={chips}
            onClearAll={() => setFields({ search: "", status: DRIVER_STATUS_TAB_ALL, page: 1 })}
          />
        )}
      </div>

      {isLoading ? (
        isMobile ? (
          <div className="space-y-2">
            <SkeletonCard count={4} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full text-sm">
              <tbody>
                <SkeletonTableRow count={5} columns={7} />
              </tbody>
            </table>
          </div>
        )
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Haydovchi topilmadi"
          description={
            hasFilters
              ? "Filtrlarni tozalab qaytadan urinib ko'ring"
              : "Birinchi haydovchini qo'shish uchun yuqoridagi tugmadan foydalaning"
          }
          action={
            has(PERMISSIONS.DRIVERS_CREATE) && !hasFilters ? (
              <Button onClick={() => openModal(MODAL.DRIVER_CREATE)}>
                <Plus size={16} className="mr-1.5" /> Yangi haydovchi
              </Button>
            ) : null
          }
        />
      ) : isMobile ? (
        <div className="space-y-2">
          {items.map((d) => (
            <DriverCard key={d._id} driver={d} />
          ))}
        </div>
      ) : (
        <DriversTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper
        name={MODAL.DRIVER_CREATE}
        title="Yangi haydovchi qo'shish"
        className="max-w-xl"
      >
        <DriverCreateModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.DRIVER_EDIT}
        title="Haydovchini tahrirlash"
        className="max-w-xl"
      >
        <DriverEditModal />
      </ModalWrapper>
    </div>
  );
};

export default DriversListPage;
