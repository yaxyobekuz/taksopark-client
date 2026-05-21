import { useParams } from "react-router-dom";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
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

  if (isLoading) return <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Ma'lumot yo'q</p>;

  const { totals, rows, currentBalance } = data;
  // Eng oxirgi oylik - joriy oylik, qolganlari - oldingilar
  const currentOylik = rows.length ? rows[rows.length - 1] : null;
  const previousOyliklar = rows.slice(0, -1);

  return (
    <div className="space-y-4">
      <Card title="Umumiy hisob-kitob">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Jami oylik</p>
            <p className="font-semibold">{formatMoney(totals.salary)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Jami berilgan</p>
            <p className="font-semibold">{formatMoney(totals.paidOut)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Jami yig'ilgan</p>
            <p>{formatMoney(totals.collected)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Jarima + Zarar</p>
            <p>{formatMoney(totals.fines + totals.damages)}</p>
          </div>
          <div className="col-span-2 md:col-span-4 border-t pt-3">
            <p className="text-xs text-muted-foreground">Joriy qoldiq</p>
            <p
              className={`text-lg font-semibold ${
                currentBalance < 0
                  ? "text-red-600"
                  : currentBalance > 0
                    ? "text-green-700"
                    : ""
              }`}
            >
              {formatMoney(currentBalance)}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                ({currentBalance < 0 ? "haydovchi qarzi" : currentBalance > 0 ? "haydovchiga to'lanishi kerak" : "balans"})
              </span>
            </p>
          </div>
        </div>
      </Card>

      {currentOylik && (
        <Card title={`Joriy oylik (#${currentOylik.oylikNumber})`}>
          <OylikSummaryCard oylik={currentOylik} />
          {currentOylik.payouts?.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">To'lovlar tarixi</p>
              <PayoutsList oylikId={currentOylik._id} payouts={currentOylik.payouts} />
            </div>
          )}
          <div className="flex gap-2 mt-4">
            {has(PERMISSIONS.OYLIKLAR_PAYOUT) && currentOylik.remainingPayout > 0 && (
              <Button
                onClick={() =>
                  openModal(MODAL.OYLIK_PAYOUT, {
                    oylik: { ...currentOylik, driver: data.driver },
                  })
                }
              >
                To'lov berish
              </Button>
            )}
          </div>
        </Card>
      )}

      {previousOyliklar.length > 0 && (
        <Card title="Oldingi oyliklar">
          <OyliklarTable items={previousOyliklar} variant="statement" />
        </Card>
      )}

      <ModalWrapper name={MODAL.OYLIK_PAYOUT} title="Oylik haqini berish" className="max-w-xl">
        <OylikPayoutModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.OYLIK_PAYOUT_EDIT} title="To'lovni tahrirlash" className="max-w-lg">
        <OylikPayoutEditModal />
      </ModalWrapper>
    </div>
  );
};

export default OylikStatementPage;
