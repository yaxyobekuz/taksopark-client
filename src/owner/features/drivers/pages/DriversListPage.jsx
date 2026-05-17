import { Plus } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { TARIFF_OPTIONS } from "@/shared/constants/tariffs";
import { useDriversQuery } from "../hooks/useDriversQuery";
import DriversTable from "../components/DriversTable";
import DriverCreateModal from "../components/modals/DriverCreateModal";
import DriverEditModal from "../components/modals/DriverEditModal";
import DriverBlockModal from "../components/modals/DriverBlockModal";
import DriverUnblockModal from "../components/modals/DriverUnblockModal";
import DriverDeleteModal from "../components/modals/DriverDeleteModal";

const STATUS_OPTIONS = [
  { value: "", label: "Barchasi" },
  { value: "active", label: "Faol" },
  { value: "blocked", label: "Bloklangan" },
  { value: "archived", label: "Arxivlangan" },
];

const DriversListPage = () => {
  const { page, search, tariff, status, setField } = useObjectState({
    page: 1,
    search: "",
    tariff: "",
    status: "active",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const { data, isLoading } = useDriversQuery({
    page,
    limit: 20,
    search: search || undefined,
    tariff: tariff || undefined,
    status: status || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Haydovchilar</h1>
        {has(PERMISSIONS.DRIVERS_CREATE) && (
          <Button onClick={() => openModal(MODAL.DRIVER_CREATE)}>
            <Plus size={16} className="mr-2" /> Yangi haydovchi
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InputField
          type="search"
          placeholder="Qidirish (ism, telefon)..."
          value={search}
          onChange={(e) => setField("search", e.target.value)}
        />
        <SelectField
          value={tariff}
          onChange={(v) => setField("tariff", v)}
          options={[{ value: "", label: "Barcha tariflar" }, ...TARIFF_OPTIONS]}
        />
        <SelectField
          value={status}
          onChange={(v) => setField("status", v)}
          options={STATUS_OPTIONS}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
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

      <ModalWrapper name={MODAL.DRIVER_CREATE} title="Yangi haydovchi qo'shish" className="max-w-xl">
        <DriverCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_EDIT} title="Haydovchini tahrirlash" className="max-w-xl">
        <DriverEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_BLOCK} title="Haydovchini bloklash">
        <DriverBlockModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_UNBLOCK} title="Blokdan chiqarish">
        <DriverUnblockModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.DRIVER_DELETE} title="Haydovchini arxivlash">
        <DriverDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default DriversListPage;
