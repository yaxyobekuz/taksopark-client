import { useEffect } from "react";
import useObjectState from "@/shared/hooks/useObjectState";
import InputField from "@/shared/components/ui/input/InputField";
import Switch from "@/shared/components/ui/switch/Switch";
import Button from "@/shared/components/ui/button/Button";
import { useAdminUpdate } from "../../hooks/useAdminMutations";

const AdminEditModal = ({ close, admin }) => {
  const { firstName, lastName, phone, isActive, setField, setFields, state } =
    useObjectState({
      firstName: admin?.firstName || "",
      lastName: admin?.lastName || "",
      phone: admin?.phone || "",
      isActive: admin?.isActive ?? true,
    });
  const { mutate, isPending } = useAdminUpdate();

  useEffect(() => {
    if (!admin) return;
    setFields({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      phone: admin.phone || "",
      isActive: admin.isActive ?? true,
    });
  }, [admin, setFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!admin?._id) return;
    mutate({ id: admin._id, ...state }, { onSuccess: () => close() });
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
      <label className="flex items-center justify-between gap-2 text-sm">
        <span>Faol</span>
        <Switch
          checked={isActive}
          onChange={(v) => setField("isActive", v)}
          disabled={isPending}
        />
      </label>
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

export default AdminEditModal;
