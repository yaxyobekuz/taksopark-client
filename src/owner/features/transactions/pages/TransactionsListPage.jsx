import { useMemo } from "react";
import { ArrowLeftRight } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";

import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonTableRow from "@/shared/components/ui/skeleton/SkeletonTableRow";

import { MONTHS } from "@/shared/constants/months";
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_WALLETS,
  TRANSACTION_WALLET_LABELS,
} from "@/shared/constants/payments";
import {
  useTransactionsQuery,
  useTransactionsSummaryQuery,
} from "../hooks/useTransactions";
import TransactionsTable from "../components/TransactionsTable";
import TransactionsSummaryCards from "../components/TransactionsSummaryCards";

const pad = (n) => String(n).padStart(2, "0");

const TransactionsListPage = () => {
  const now = new Date();
  const { page, type, wallet, month, year, setField, setFields } = useObjectState({
    page: 1,
    type: "",
    wallet: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const yearOptions = useMemo(() => {
    const max = new Date().getFullYear();
    const list = [];
    for (let y = max; y >= max - 5; y--)
      list.push({ value: y, label: String(y) });
    return list;
  }, []);

  const fromDate = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDate = `${year}-${pad(month)}-${pad(lastDay)}`;

  const params = {
    page,
    limit: 20,
    type: type || undefined,
    wallet: wallet || undefined,
    fromDate,
    toDate,
  };
  const { data, isLoading } = useTransactionsQuery(params);
  const { data: summary } = useTransactionsSummaryQuery({
    fromDate,
    toDate,
    wallet: wallet || undefined,
  });

  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  const typeOptions = [
    { value: "", label: "Hammasi" },
    { value: TRANSACTION_TYPES.INCOME, label: TRANSACTION_TYPE_LABELS.income },
    {
      value: TRANSACTION_TYPES.EXPENSE,
      label: TRANSACTION_TYPE_LABELS.expense,
    },
  ];

  const walletOptions = [
    { value: "", label: "Hamma hamyon" },
    ...Object.values(TRANSACTION_WALLETS).map((w) => ({
      value: w,
      label: TRANSACTION_WALLET_LABELS[w],
    })),
  ];

  return (
    <div className="space-y-4">
      <TransactionsSummaryCards summary={summary} />

      <div className="-mx-4 px-4 py-3 bg-background border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <SelectField
            label="Hamyon"
            value={wallet}
            onChange={(v) => setFields({ wallet: v, page: 1 })}
            options={walletOptions}
          />
          <SelectField
            label="Turi"
            value={type}
            onChange={(v) => setFields({ type: v, page: 1 })}
            options={typeOptions}
          />
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
          description="Tanlangan davrda kirim-chiqim mavjud emas"
        />
      ) : (
        <TransactionsTable items={items} />
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

export default TransactionsListPage;
