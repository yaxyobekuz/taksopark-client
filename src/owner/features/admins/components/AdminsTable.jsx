import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";
import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";

const stop = (e) => e.stopPropagation();

const AdminsTable = ({ items = [] }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();

  if (!items.length) {
    return <p className="text-sm text-muted-foreground p-4">Admin yo'q</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">F.I.SH</th>
            <th className="text-left p-3">Login</th>
            <th className="text-left p-3">Ruxsatlar</th>
            <th className="text-left p-3">Holat</th>
            <th className="text-right p-3">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr
              key={a._id}
              className="border-b last:border-0 cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/owner/admins/${a._id}`)}
            >
              <td className="p-3">{`${a.firstName} ${a.lastName || ""}`.trim()}</td>
              <td className="p-3 font-medium">{a.username}</td>
              <td className="p-3 text-muted-foreground">{(a.permissions || []).length} ta</td>
              <td className="p-3">
                {a.isActive ? (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-50 text-green-700">Faol</span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">Faol emas</span>
                )}
              </td>
              <td className="p-3" onClick={stop}>
                <div className="flex items-center justify-end gap-1">
                  {has(PERMISSIONS.ADMINS_UPDATE) && (
                    <>
                      <button
                        type="button"
                        title="Tahrirlash"
                        className="p-1.5 rounded hover:bg-muted"
                        onClick={() => openModal(MODAL.ADMIN_EDIT, { admin: a })}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        title="Parol"
                        className="p-1.5 rounded hover:bg-muted"
                        onClick={() => openModal(MODAL.ADMIN_PASSWORD, { admin: a })}
                      >
                        <KeyRound size={15} />
                      </button>
                    </>
                  )}
                  {has(PERMISSIONS.ADMINS_DELETE) && (
                    <button
                      type="button"
                      title="O'chirish"
                      className="p-1.5 rounded hover:bg-muted text-red-600"
                      onClick={() => openModal(MODAL.ADMIN_DELETE, { admin: a })}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsTable;
