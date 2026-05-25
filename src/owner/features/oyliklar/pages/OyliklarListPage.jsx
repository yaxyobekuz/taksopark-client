import { useSearchParams } from "react-router-dom";
import { CalendarRange } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";
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
  const meta = data?.meta || { pages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Oyliklar"
        description={meta.total ? `Jami ${meta.total} ta` : ""}
      />

      {isLoading ? (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRow count={5} columns={6} />
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Oylik yo'q"
          description="Hozircha hech qanday oylik yozuvi yo'q"
        />
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
