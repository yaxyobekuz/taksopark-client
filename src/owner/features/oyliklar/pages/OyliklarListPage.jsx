import { useSearchParams } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { useOyliklarQuery } from "../hooks/useOyliklarQuery";
import OyliklarTable from "../components/OyliklarTable";
import OylikPayoutModal from "../components/modals/OylikPayoutModal";
import OylikPayoutEditModal from "../components/modals/OylikPayoutEditModal";

const OyliklarListPage = () => {
  const [searchParams] = useSearchParams();
  const driverIdParam = searchParams.get("driverId") || "";
  const { page, setField } = useObjectState({ page: 1 });

  const { data, isLoading } = useOyliklarQuery({
    page,
    limit: 20,
    driverId: driverIdParam || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Oyliklar</h1>
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
        name={MODAL.OYLIK_PAYOUT}
        title="Oylik haqini berish"
        className="max-w-xl"
      >
        <OylikPayoutModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.OYLIK_PAYOUT_EDIT}
        title="To'lovni tahrirlash"
        className="max-w-lg"
      >
        <OylikPayoutEditModal />
      </ModalWrapper>
    </div>
  );
};

export default OyliklarListPage;
