import { useMemo } from "react";
import { Plus } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import Button from "@/shared/components/ui/button/Button";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
} from "@/shared/constants/payments";
import {
  useTransactionsQuery,
  useTransactionsSummaryQuery,
} from "../hooks/useTransactions";
import TransactionsTable from "../components/TransactionsTable";
import TransactionsSummaryCards from "../components/TransactionsSummaryCards";
import TransactionCreateModal from "../components/modals/TransactionCreateModal";

const MONTHS = [
  { value: 1, label: "Yanvar" },
  { value: 2, label: "Fevral" },
  { value: 3, label: "Mart" },
  { value: 4, label: "Aprel" },
  { value: 5, label: "May" },
  { value: 6, label: "Iyun" },
  { value: 7, label: "Iyul" },
  { value: 8, label: "Avgust" },
  { value: 9, label: "Sentabr" },
  { value: 10, label: "Oktabr" },
  { value: 11, label: "Noyabr" },
  { value: 12, label: "Dekabr" },
];

const pad = (n) => String(n).padStart(2, "0");

const TransactionsListPage = () => {
  const now = new Date();
  const { page, type, month, year, setField } = useObjectState({
    page: 1,
    type: "",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  const { openModal } = useModal();
  const { has } = usePermissions();

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
    fromDate,
    toDate,
  };
  const { data, isLoading } = useTransactionsQuery(params);
  const { data: summary } = useTransactionsSummaryQuery({ fromDate, toDate });

  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  const typeOptions = [
    { value: "", label: "Hammasi" },
    { value: TRANSACTION_TYPES.INCOME, label: TRANSACTION_TYPE_LABELS.income },
    {
      value: TRANSACTION_TYPES.EXPENSE,
      label: TRANSACTION_TYPE_LABELS.expense,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Kirim-Chiqim</h1>
        {has(PERMISSIONS.TRANSACTIONS_CREATE) && (
          <Button onClick={() => openModal(MODAL.TRANSACTION_CREATE)}>
            <Plus size={16} className="mr-2" /> Yangi tranzaksiya
          </Button>
        )}
      </div>

      <TransactionsSummaryCards summary={summary} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectField
          label="Turi"
          value={type}
          onChange={(v) => setField("type", v)}
          options={typeOptions}
        />
        <SelectField
          label="Oy"
          value={month}
          onChange={(v) => setField("month", Number(v))}
          options={MONTHS}
        />
        <SelectField
          label="Yil"
          value={year}
          onChange={(v) => setField("year", Number(v))}
          options={yearOptions}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
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

      <ModalWrapper
        name={MODAL.TRANSACTION_CREATE}
        title="Yangi tranzaksiya"
        className="max-w-lg"
      >
        <TransactionCreateModal />
      </ModalWrapper>
    </div>
  );
};

export default TransactionsListPage;
