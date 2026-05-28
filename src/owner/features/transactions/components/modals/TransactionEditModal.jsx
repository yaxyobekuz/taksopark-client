import { useTransactionUpdate } from "../../hooks/useTransactions";
import TransactionForm from "./TransactionForm";

const TransactionEditModal = ({ close, transaction }) => {
  const { mutate, isPending } = useTransactionUpdate();

  if (!transaction) return null;

  const initial = {
    type: transaction.type,
    category: transaction.category || "",
    amount: transaction.amount,
    date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 10) : "",
    note: transaction.note || "",
  };

  const handleSubmit = (values) => {
    mutate({ id: transaction._id, ...values }, { onSuccess: () => close() });
  };

  return (
    <TransactionForm
      initial={initial}
      onSubmit={handleSubmit}
      onCancel={() => close()}
      isPending={isPending}
    />
  );
};

export default TransactionEditModal;
