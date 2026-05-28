import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Button from "@/shared/components/ui/button/Button";
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "@/shared/constants/payments";
import { useTransactionCategoriesQuery } from "@/owner/features/transactionCategories";

const TransactionForm = ({ initial, onSubmit, onCancel, isPending, submitLabel = "Saqlash" }) => {
  const { type, category, amount, date, note, setField, setFields } = useObjectState({
    type: initial?.type || TRANSACTION_TYPES.EXPENSE,
    category: initial?.category || "",
    amount: initial?.amount ?? "",
    date: initial?.date || new Date().toISOString().slice(0, 10),
    note: initial?.note || "",
  });
  const { data: categories = [] } = useTransactionCategoriesQuery(type);

  // Tur o'zgarsa tanlangan kategoriya yangi ro'yxatda bo'lmasligi mumkin -> moslab qo'yamiz
  useEffect(() => {
    if (!categories.length) {
      if (category) setField("category", "");
      return;
    }
    const exists = categories.some((c) => c.name === category);
    if (!exists) setField("category", categories[0].name);
  }, [categories, category, setField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    onSubmit({ type, category, amount: Number(amount), date, note });
  };

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: TRANSACTION_TYPE_LABELS.income },
    { value: TRANSACTION_TYPES.EXPENSE, label: TRANSACTION_TYPE_LABELS.expense },
  ];
  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));
  const noCategories = categories.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SelectField
        label="Turi"
        value={type}
        onChange={(v) => setFields({ type: v, category: "" })}
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
        disabled={isPending || noCategories}
      />
      {noCategories && (
        <p className="text-xs text-muted-foreground">
          Bu tur uchun kategoriya yo'q. Avval Sozlamalar &gt; Tranzaksiya kategoriyalari bo'limidan qo'shing.
        </p>
      )}
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
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending || noCategories}>
          {isPending ? "Saqlanmoqda..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
