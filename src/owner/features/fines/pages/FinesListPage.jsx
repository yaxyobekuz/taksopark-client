import { useSearchParams } from "react-router-dom";
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
import { useFinesQuery } from "../hooks/useFinesQuery";
import FinesTable from "../components/FinesTable";
import FineCreateModal from "../components/modals/FineCreateModal";
import FineDeleteModal from "../components/modals/FineDeleteModal";
import FinePayModal from "../components/modals/FinePayModal";

const FinesListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";

  const { page, fromDate, toDate, setField } = useObjectState({
    page: 1,
    fromDate: "",
    toDate: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const { data, isLoading } = useFinesQuery({
    page,
    limit: 20,
    driverId: driverIdParam || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Jarimalar</h1>
        {has(PERMISSIONS.FINES_CREATE) && (
          <Button onClick={() => openModal(MODAL.FINE_CREATE, { presetDriverId: driverIdParam })}>
            <Plus size={16} className="mr-2" /> Yangi jarima
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField label="Dan" type="date" value={fromDate} onChange={(e) => setField("fromDate", e.target.value)} />
        <InputField label="Gacha" type="date" value={toDate} onChange={(e) => setField("toDate", e.target.value)} />
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Yuklanmoqda...</p> : <FinesTable items={items} />}

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

export default FinesListPage;
