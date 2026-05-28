import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { TRANSACTION_TYPES } from "@/shared/constants/payments";
import { useTransactionCategoryCreate } from "../../hooks/useTransactionCategoryMutations";

const TransactionCategoryCreateModal = ({ close, type = TRANSACTION_TYPES.EXPENSE }) => {
  const { name, setField, resetState } = useObjectState({ name: "" });
  const { mutate, isPending } = useTransactionCategoryCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate(
      { name: name.trim(), type },
      {
        onSuccess: () => {
          resetState();
          close();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Nom"
        value={name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="Yoqilg'i"
        required
        disabled={isPending}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionCategoryCreateModal;
