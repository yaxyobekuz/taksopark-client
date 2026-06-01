import { useParams } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import BackLink from "@/shared/components/ui/link/BackLink";
import { ArrowLeftRight } from "lucide-react";
import {
  TRANSACTION_DIRECTIONS,
  TRANSACTION_SOURCE_LABELS,
  TRANSACTION_WALLET_LABELS,
  TRANSACTION_WALLETS,
} from "@/shared/constants/payments";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { useTransactionsQuery } from "@/owner/features/transactions/hooks/useTransactions";
import { useFinanceOverviewQuery } from "../hooks/useFinanceReport";

const WalletDetailPage = () => {
  const { wallet } = useParams();
  const isValidWallet = Object.values(TRANSACTION_WALLETS).includes(wallet);

  const { page, setField } = useObjectState({ page: 1 });

  // Umumiy balans (barcha vaqt) uchun fromDate yubormaymiz.
  const { data: overview } = useFinanceOverviewQuery({});
  const stat = overview?.wallets?.[wallet];

  // Tranzaksiyalar — barcha vaqt, sahifalashtirish bilan.
  const { data, isLoading } = useTransactionsQuery({
    page,
    limit: 20,
    wallet,
  });

  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  if (!isValidWallet) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Hamyon topilmadi"
        description="Bu hamyon mavjud emas"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <BackLink to="/owner/finance-report" />
        <h1 className="text-xl font-bold mt-2">
          {TRANSACTION_WALLET_LABELS[wallet]}
        </h1>
      </div>

      {stat && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Jami kirim</div>
            <div className="font-semibold text-emerald-700">
              +{formatMoney(stat.in)}
            </div>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Jami chiqim</div>
            <div className="font-semibold text-red-700">
              −{formatMoney(stat.out)}
            </div>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Joriy balans</div>
            <div className="font-semibold">{formatMoney(stat.closingBalance)}</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <tbody>
              <SkeletonTableRow count={5} columns={5} />
            </tbody>
          </table>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="Tranzaksiya yo'q"
          description="Bu hamyonda hech qanday harakat yo'q"
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3">Sana</th>
                <th className="text-left p-3">Yo'nalish</th>
                <th className="text-left p-3">Manba</th>
                <th className="text-left p-3">Haydovchi</th>
                <th className="text-right p-3">Summa</th>
                <th className="text-left p-3">Izoh</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => {
                const isIn = t.direction === TRANSACTION_DIRECTIONS.IN;
                return (
                  <tr key={t._id} className="border-t">
                    <td className="p-3">{formatDateUZ(t.date)}</td>
                    <td className="p-3">
                      <span className={isIn ? "text-emerald-700" : "text-red-700"}>
                        {isIn ? "Kirim" : "Chiqim"}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {TRANSACTION_SOURCE_LABELS[t.source] || t.source}
                    </td>
                    <td className="p-3">
                      {t.driver
                        ? `${t.driver.firstName} ${t.driver.lastName || ""}`.trim()
                        : "-"}
                    </td>
                    <td
                      className={`p-3 text-right font-medium ${isIn ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {isIn ? "+" : "−"}
                      {formatMoney(t.amount)}
                    </td>
                    <td className="p-3 text-muted-foreground">{t.note || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />
    </div>
  );
};

export default WalletDetailPage;
