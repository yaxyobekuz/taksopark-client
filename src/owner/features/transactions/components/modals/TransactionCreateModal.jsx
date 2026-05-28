import { TRANSACTION_SOURCES } from "@/shared/constants/payments";
import { useTransactionCreate } from "../../hooks/useTransactions";
import TransactionForm from "./TransactionForm";

const TransactionCreateModal = ({ close }) => {
  const { mutate, isPending } = useTransactionCreate();

  const handleSubmit = (values) => {
    mutate(
      { ...values, source: TRANSACTION_SOURCES.MANUAL },
      { onSuccess: () => close() },
    );
  };

  return (
    <TransactionForm
      onSubmit={handleSubmit}
      onCancel={() => close()}
      isPending={isPending}
    />
  );
};

export default TransactionCreateModal;
