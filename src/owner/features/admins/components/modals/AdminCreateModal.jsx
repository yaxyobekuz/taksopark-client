import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Button from "@/shared/components/ui/button/Button";
import { useAdminCreate } from "../../hooks/useAdminMutations";

const AdminCreateModal = ({ close }) => {
  const { firstName, lastName, username, password, phone, setField, state } =
    useObjectState({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      phone: "",
    });
  const { mutate, isPending } = useAdminCreate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password) return;
    mutate(state, { onSuccess: () => close() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField
          label="Ism"
          value={firstName}
          onChange={(e) => setField("firstName", e.target.value)}
          required
          disabled={isPending}
        />
        <InputField
          label="Familiya"
          value={lastName}
          onChange={(e) => setField("lastName", e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <InputField
        label="Telefon"
        type="tel"
        value={phone}
        onChange={(e) => setField("phone", e.target.value)}
        disabled={isPending}
      />
      <InputField
        label="Login"
        value={username}
        onChange={(e) => setField("username", e.target.value)}
        placeholder="admin1"
        required
        disabled={isPending}
      />
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

export default AdminCreateModal;
