import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const FilterChips = ({ items = [], onClearAll = null, className = "" }) => {
  const visible = items.filter(Boolean);
  if (!visible.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {visible.map((it, i) => (
        <span
          key={it.key || `${it.label}-${i}`}
          className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs bg-muted text-gray-700 rounded-full border"
        >
          {it.label}
          {it.onRemove && (
            <button
              type="button"
              onClick={it.onRemove}
              className="ml-0.5 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="O'chirish"
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </span>
      ))}
      {visible.length > 1 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-gray-900 px-2"
        >
          Tozalash
        </button>
      )}
    </div>
  );
};

export default FilterChips;
