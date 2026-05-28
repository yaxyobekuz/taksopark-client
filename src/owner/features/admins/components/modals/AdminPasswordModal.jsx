import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useAdminChangePassword } from "../../hooks/useAdminMutations";

const AdminPasswordModal = ({ close, admin }) => {
  const { password, setField, setFields } = useObjectState({
    password: admin?.password || "",
  });
  const { mutate, isPending } = useAdminChangePassword();

  useEffect(() => {
    if (admin) setFields({ password: admin.password || "" });
  }, [admin, setFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!admin?._id || !password) return;
    mutate({ id: admin._id, password }, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{admin?.username}</span> uchun parol.
        Joriy parol ko'rinib turibdi.
      </p>
      <InputField
        label="Parol"
        type="password"
        value={password}
        onChange={(e) => setField("password", e.target.value)}
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

export default AdminPasswordModal;
