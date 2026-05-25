import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useCarDocumentTypeCreate } from "../../hooks/useCarDocumentTypeMutations";

const CarDocumentTypeCreateModal = ({ close }) => {
  const { name, setField, state, resetState } = useObjectState({ name: "" });
  const { mutate, isPending } = useCarDocumentTypeCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate(state, {
      onSuccess: () => {
        resetState();
        close();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Nom"
        value={name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="Texnik ko'rik"
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

export default CarDocumentTypeCreateModal;
