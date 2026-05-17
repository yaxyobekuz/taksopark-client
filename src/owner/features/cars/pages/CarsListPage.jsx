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
import { useCarsQuery } from "../hooks/useCarsQuery";
import CarsTable from "../components/CarsTable";
import CarCreateModal from "../components/modals/CarCreateModal";
import CarEditModal from "../components/modals/CarEditModal";
import CarDeleteModal from "../components/modals/CarDeleteModal";

const CarsListPage = () => {
  const { page, search, setField } = useObjectState({ page: 1, search: "" });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const { data, isLoading } = useCarsQuery({ page, limit: 20, search: search || undefined });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Mashinalar</h1>
        {has(PERMISSIONS.CARS_CREATE) && (
          <Button onClick={() => openModal(MODAL.CAR_CREATE)}>
            <Plus size={16} className="mr-2" /> Yangi mashina
          </Button>
        )}
      </div>

      <InputField
        type="search"
        placeholder="Qidirish (raqam, model, VIN)..."
        value={search}
        onChange={(e) => setField("search", e.target.value)}
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
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
      <ModalWrapper name={MODAL.CAR_DELETE} title="Mashinani o'chirish">
        <CarDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default CarsListPage;
