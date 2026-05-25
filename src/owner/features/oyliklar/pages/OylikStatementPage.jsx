import { useParams } from "react-router-dom";
import { Wallet, HandCoins, Scale } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import StatCard from "@/shared/components/ui/card/StatCard";
import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import SkeletonStatCard from "@/shared/components/ui/skeleton/SkeletonStatCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { formatMoney } from "@/shared/utils/formatMoney";

import { useOylikStatementQuery } from "../hooks/useOylikStatementQuery";
import OyliklarTable from "../components/OyliklarTable";
import OylikSummaryCard from "../components/OylikSummaryCard";
import PayoutsList from "../components/PayoutsList";
import OylikPayoutModal from "../components/modals/OylikPayoutModal";
import OylikPayoutEditModal from "../components/modals/OylikPayoutEditModal";

const OylikStatementPage = () => {
  const { id } = useParams();
  const driverId = id;
  const { data, isLoading } = useOylikStatementQuery(driverId);
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SkeletonStatCard count={3} />
        </div>
        <SkeletonCard count={2} />
      </div>
    );
  }

  if (!data) {
    return <EmptyState title="Ma'lumot yo'q" />;
  }

  const { totals, rows, currentBalance } = data;
  const currentOylik = rows.length ? rows[rows.length - 1] : null;
  const previousOyliklar = rows.slice(0, -1);

  const balanceHint =
    currentBalance < 0
      ? "haydovchi qarzi"
      : currentBalance > 0
        ? "haydovchiga to'lanishi kerak"
        : "balans";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Joriy qoldiq"
          value={currentBalance}
          icon={Scale}
          tone={currentBalance < 0 ? "negative" : currentBalance > 0 ? "positive" : "default"}
          isMoney
          hint={balanceHint}
        />
        <StatCard
          label="Jami oylik"
          value={totals.salary}
          icon={Wallet}
          tone="info"
          isMoney
        />
        <StatCard
          label="Jami berilgan"
          value={totals.paidOut}
          icon={HandCoins}
          tone="default"
          isMoney
        />
      </div>

      <DetailSection title="Boshqa ko'rsatkichlar" defaultOpen={false}>
        <KeyValueList
          columns={2}
          items={[
            { label: "Jami yig'ilgan", value: formatMoney(totals.collected) },
            { label: "Jami jarima", value: formatMoney(totals.fines) },
            { label: "Jami zarar", value: formatMoney(totals.damages) },
            {
              label: "Jami chegirma",
              value: formatMoney(totals.fines + totals.damages),
            },
          ]}
        />
      </DetailSection>

      {currentOylik && (
        <DetailSection
          title={`Joriy oylik (#${currentOylik.oylikNumber})`}
          defaultOpen
          actions={
            has(PERMISSIONS.OYLIKLAR_PAYOUT) &&
            currentOylik.remainingPayout > 0 && (
              <Button
                size="sm"
                onClick={() =>
                  openModal(MODAL.OYLIK_PAYOUT, {
                    oylik: { ...currentOylik, driver: data.driver },
                  })
                }
              >
                To'lov berish
              </Button>
            )
          }
        >
          <OylikSummaryCard oylik={currentOylik} />
          {currentOylik.payouts?.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">To'lovlar tarixi</p>
              <PayoutsList
                oylikId={currentOylik._id}
                payouts={currentOylik.payouts}
              />
            </div>
          )}
        </DetailSection>
      )}

      {previousOyliklar.length > 0 && (
        <DetailSection title="Oldingi oyliklar" defaultOpen={false}>
          <OyliklarTable items={previousOyliklar} variant="statement" />
        </DetailSection>
      )}

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

export default OylikStatementPage;
