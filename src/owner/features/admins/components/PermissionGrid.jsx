import { useMemo } from "react";
import Switch from "@/shared/components/ui/switch/Switch";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import { usePermissionCatalogQuery } from "../hooks/usePermissionCatalogQuery";

const GROUP_LABELS = {
  users: "Foydalanuvchilar",
  audit: "Audit",
  drivers: "Haydovchilar",
  cars: "Mashinalar",
  payments: "Kunlik to'lovlar",
  fines: "Jarimalar",
  damages: "Zararlar",
  oyliklar: "Oyliklar",
  transactions: "Kirim-chiqim",
  reports: "Hisobotlar",
  general: "Boshqa",
};

const PermissionGrid = ({ value = [], onChange, disabled }) => {
  const { data: catalog = [], isLoading } = usePermissionCatalogQuery();
  const selected = useMemo(() => new Set(value), [value]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const item of catalog) {
      const g = item.group || "general";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(item);
    }
    return [...map.entries()];
  }, [catalog]);

  if (isLoading) return <SkeletonCard count={2} />;

  const toggle = (key) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange([...next]);
  };

  const toggleGroup = (items, allOn) => {
    const next = new Set(selected);
    for (const it of items) {
      if (allOn) next.delete(it.key);
      else next.add(it.key);
    }
    onChange([...next]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {groups.map(([group, items]) => {
        const allOn = items.every((it) => selected.has(it.key));
        return (
          <div key={group} className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">
                {GROUP_LABELS[group] || group}
              </h4>
              <button
                type="button"
                className="text-xs text-primary hover:underline disabled:opacity-50"
                onClick={() => toggleGroup(items, allOn)}
                disabled={disabled}
              >
                {allOn ? "Bekor qilish" : "Barchasini tanlash"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((it) => (
                <label
                  key={it.key}
                  className="flex items-center justify-between gap-4 text-sm py-1"
                >
                  <span className="text-muted-foreground">{it.label}</span>
                  <Switch
                    checked={selected.has(it.key)}
                    onChange={() => toggle(it.key)}
                    disabled={disabled}
                  />
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionGrid;
