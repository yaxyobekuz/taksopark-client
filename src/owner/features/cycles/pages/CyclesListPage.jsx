import { useSearchParams } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { useCyclesQuery } from "../hooks/useCyclesQuery";
import CyclesTable from "../components/CyclesTable";
import CycleSettleModal from "../components/modals/CycleSettleModal";

const STATUS_OPTIONS = [
  { value: "", label: "Barchasi" },
  { value: "open", label: "Ochiq" },
  { value: "settled", label: "Yakunlangan" },
];

const CyclesListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";
  const { page, status, setField } = useObjectState({ page: 1, status: "" });

  const { data, isLoading } = useCyclesQuery({
    page,
    limit: 20,
    driverId: driverIdParam || undefined,
    status: status || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Oylik tsikllar</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectField value={status} onChange={(v) => setField("status", v)} options={STATUS_OPTIONS} />
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Yuklanmoqda...</p> : <CyclesTable items={items} />}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.CYCLE_SETTLE} title="Tsiklni yakunlash" className="max-w-2xl">
        <CycleSettleModal />
      </ModalWrapper>
    </div>
  );
};

export default CyclesListPage;
