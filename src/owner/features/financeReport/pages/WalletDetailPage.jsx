import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import SelectField from "@/shared/components/ui/select/SelectField";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import BackLink from "@/shared/components/ui/link/BackLink";
import { ArrowLeftRight } from "lucide-react";
import { MONTHS } from "@/shared/constants/months";
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

const pad = (n) => String(n).padStart(2, "0");

const WalletDetailPage = () => {
  const { wallet } = useParams();
  const isValidWallet = Object.values(TRANSACTION_WALLETS).includes(wallet);

  const now = new Date();
  const { page, month, year, setField, setFields } = useObjectState({
    page: 1,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const yearOptions = useMemo(() => {
    const max = new Date().getFullYear();
    const list = [];
    for (let y = max; y >= max - 5; y--) list.push({ value: y, label: String(y) });
    return list;
  }, []);

  const fromDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  const { data: overview } = useFinanceOverviewQuery({ fromDate, toDate });
  const stat = overview?.wallets?.[wallet];

  const { data, isLoading } = useTransactionsQuery({
    page,
    limit: 20,
    wallet,
    fromDate,
    toDate,
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Davr boshi</div>
            <div className="font-semibold">{formatMoney(stat.openingBalance)}</div>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Kirim</div>
            <div className="font-semibold text-emerald-700">
              +{formatMoney(stat.in)}
            </div>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Chiqim</div>
            <div className="font-semibold text-red-700">
              −{formatMoney(stat.out)}
            </div>
          </div>
          <div className="rounded-md border bg-white p-3">
            <div className="text-xs text-muted-foreground">Davr oxiri</div>
            <div className="font-semibold">{formatMoney(stat.closingBalance)}</div>
          </div>
        </div>
      )}

      <div className="-mx-4 px-4 py-3 bg-background border-b">
        <div className="grid grid-cols-2 gap-2 max-w-md">
          <SelectField
            label="Oy"
            value={month}
            onChange={(v) => setFields({ month: Number(v), page: 1 })}
            options={MONTHS}
          />
          <SelectField
            label="Yil"
            value={year}
            onChange={(v) => setFields({ year: Number(v), page: 1 })}
            options={yearOptions}
          />
        </div>
      </div>

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
          description="Tanlangan davrda bu hamyonda harakat yo'q"
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
                      <span
                        className={
                          isIn ? "text-emerald-700" : "text-red-700"
                        }
                      >
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
