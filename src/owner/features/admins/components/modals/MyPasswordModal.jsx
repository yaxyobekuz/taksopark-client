import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useChangeMyPasswordMutation } from "../../hooks/useChangeMyPasswordMutation";

const MyPasswordModal = ({ close }) => {
  const { currentPassword, newPassword, setField, state, resetState } = useObjectState({
    currentPassword: "",
    newPassword: "",
  });
  const { mutate, isPending } = useChangeMyPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
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
        label="Joriy parol"
        type="password"
        value={currentPassword}
        onChange={(e) => setField("currentPassword", e.target.value)}
        required
        disabled={isPending}
      />
      <InputField
        label="Yangi parol"
        type="password"
        value={newPassword}
        onChange={(e) => setField("newPassword", e.target.value)}
        required
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

export default MyPasswordModal;
