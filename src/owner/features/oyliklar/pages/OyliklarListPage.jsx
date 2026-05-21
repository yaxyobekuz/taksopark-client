import { useSearchParams } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { useOyliklarQuery } from "../hooks/useOyliklarQuery";
import OyliklarTable from "../components/OyliklarTable";
import OylikCloseModal from "../components/modals/OylikCloseModal";
import OylikPayoutModal from "../components/modals/OylikPayoutModal";

const STATUS_OPTIONS = [
  { value: "", label: "Barchasi" },
  { value: "active", label: "Faol" },
  { value: "closed", label: "Yopilgan" },
];

const OyliklarListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";
  const { page, status, setField } = useObjectState({ page: 1, status: "" });

  const { data, isLoading } = useOyliklarQuery({
    page,
    limit: 20,
    driverId: driverIdParam || undefined,
    status: status || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Oyliklar</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectField
          value={status}
          onChange={(v) => setField("status", v)}
          options={STATUS_OPTIONS}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      ) : (
        <OyliklarTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper
        name={MODAL.OYLIK_CLOSE}
        title="Oylikni yopish"
        className="max-w-2xl"
      >
        <OylikCloseModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.OYLIK_PAYOUT}
        title="Oylik haqini berish"
        className="max-w-xl"
      >
        <OylikPayoutModal />
      </ModalWrapper>
    </div>
  );
};

export default OyliklarListPage;
