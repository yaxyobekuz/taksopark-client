import { Plus } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "@/shared/constants/payments";
import { useTransactionsQuery, useTransactionsSummaryQuery } from "../hooks/useTransactions";
import TransactionsTable from "../components/TransactionsTable";
import TransactionsSummaryCards from "../components/TransactionsSummaryCards";
import TransactionCreateModal from "../components/modals/TransactionCreateModal";

const TransactionsListPage = () => {
  const { page, type, fromDate, toDate, setField } = useObjectState({
    page: 1,
    type: "",
    fromDate: "",
    toDate: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const params = {
    page,
    limit: 20,
    type: type || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  };
  const { data, isLoading } = useTransactionsQuery(params);
  const { data: summary } = useTransactionsSummaryQuery({
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });

  const items = data?.data || [];
  const meta = data?.meta || { pages: 1 };

  const typeOptions = [
    { value: "", label: "Hammasi" },
    { value: TRANSACTION_TYPES.INCOME, label: TRANSACTION_TYPE_LABELS.income },
    { value: TRANSACTION_TYPES.EXPENSE, label: TRANSACTION_TYPE_LABELS.expense },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Kirim-Chiqim</h1>
        {has(PERMISSIONS.TRANSACTIONS_CREATE) && (
          <Button onClick={() => openModal(MODAL.TRANSACTION_CREATE)}>
            <Plus size={16} className="mr-2" /> Yangi yozuv
          </Button>
        )}
      </div>

      <TransactionsSummaryCards summary={summary} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SelectField label="Turi" value={type} onChange={(v) => setField("type", v)} options={typeOptions} />
        <InputField label="Dan" type="date" value={fromDate} onChange={(e) => setField("fromDate", e.target.value)} />
        <InputField label="Gacha" type="date" value={toDate} onChange={(e) => setField("toDate", e.target.value)} />
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Yuklanmoqda...</p> : <TransactionsTable items={items} />}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.TRANSACTION_CREATE} title="Yangi yozuv" className="max-w-lg">
        <TransactionCreateModal />
      </ModalWrapper>
    </div>
  );
};

export default TransactionsListPage;
