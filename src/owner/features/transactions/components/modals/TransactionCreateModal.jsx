import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_SOURCES,
  MANUAL_CATEGORIES,
} from "@/shared/constants/payments";
import { useTransactionCreate } from "../../hooks/useTransactions";

const TransactionCreateModal = ({ close }) => {
  const { type, category, amount, date, note, setField, state, resetState } = useObjectState({
    type: TRANSACTION_TYPES.EXPENSE,
    category: MANUAL_CATEGORIES[0],
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const { mutate, isPending } = useTransactionCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    mutate(
      {
        type,
        source: TRANSACTION_SOURCES.MANUAL,
        category,
        amount: Number(amount),
        date,
        note,
      },
      {
        onSuccess: () => {
          resetState();
          close();
        },
      },
    );
  };

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: TRANSACTION_TYPE_LABELS.income },
    { value: TRANSACTION_TYPES.EXPENSE, label: TRANSACTION_TYPE_LABELS.expense },
  ];
  const categoryOptions = MANUAL_CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Turi"
        value={type}
        onChange={(v) => setField("type", v)}
        options={typeOptions}
        required
        disabled={isPending}
      />
      <SelectField
        label="Kategoriya"
        value={category}
        onChange={(v) => setField("category", v)}
        options={categoryOptions}
        required
        disabled={isPending}
      />
      <InputField
        label="Summa (so'm)"
        type="price"
        value={amount}
        onChange={(e) => setField("amount", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Sana"
        type="date"
        value={date}
        onChange={(e) => setField("date", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Izoh"
        type="textarea"
        value={note}
        onChange={(e) => setField("note", e.target.value)}
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionCreateModal;
