import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";

const COLUMNS_CLASS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard?.writeText(String(value));
    setCopied(true);
    toast.success("Nusxalandi");
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="opacity-60 hover:opacity-100 transition-opacity"
      aria-label="Nusxalash"
    >
      {copied ? (
        <Check size={14} strokeWidth={1.5} className="text-green-600" />
      ) : (
        <Copy size={14} strokeWidth={1.5} />
      )}
    </button>
  );
};

const KeyValueList = ({ items = [], columns = 2, className = "" }) => {
  const visible = items.filter(
    (it) => it && (it.value !== null && it.value !== undefined && it.value !== ""),
  );

  if (!visible.length) return null;

  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-3",
        COLUMNS_CLASS[columns] || COLUMNS_CLASS[2],
        className,
      )}
    >
      {visible.map((it, i) => (
        <div
          key={it.label ? `${it.label}-${i}` : i}
          className={cn(
            "flex flex-col gap-0.5 min-w-0",
            it.fullWidth ? "sm:col-span-2 lg:col-span-3" : "",
          )}
        >
          <dt className="text-xs text-muted-foreground">{it.label}</dt>
          <dd className="text-sm text-gray-900 flex items-center gap-1.5 min-w-0">
            {it.href ? (
              <a
                href={it.href}
                target={it.external ? "_blank" : undefined}
                rel={it.external ? "noopener noreferrer" : undefined}
                className="text-primary hover:underline truncate"
              >
                {it.value}
              </a>
            ) : (
              <span className={cn("truncate", it.mono && "font-mono")}>
                {it.value}
              </span>
            )}
            {it.copyable && <CopyButton value={it.value} />}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default KeyValueList;
