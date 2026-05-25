import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/shadcn/field";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { cn } from "@/shared/utils/cn";

const MAX_SIZE_BYTES = 20 * 1024 * 1024;

const InputImages = ({
  id = "",
  name = "",
  label = "",
  description,
  existing = [],
  files = [],
  removedUrls = [],
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  onRestoreExisting,
  disabled = false,
  required = false,
  className = "",
  maxFiles = 10,
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const newPreviews = useMemo(
    () => files.map((f) => ({ key: `new-${f.name}-${f.size}`, file: f, url: URL.createObjectURL(f) })),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const p of newPreviews) URL.revokeObjectURL(p.url);
    };
  }, [newPreviews]);

  const open = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    const accepted = [];
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        setError("Faqat rasm fayllari qabul qilinadi");
        continue;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setError("Fayl hajmi 20 MB dan oshmasligi kerak");
        continue;
      }
      accepted.push(f);
    }
    const room = maxFiles - (existing.length - removedUrls.length) - files.length;
    if (room <= 0) {
      setError(`Maksimum ${maxFiles} ta fayl`);
      return;
    }
    if (accepted.length) {
      setError("");
      onAdd?.(accepted.slice(0, room));
    }
  };

  const visibleExisting = existing.filter((e) => !removedUrls.includes(e.url));

  return (
    <Field data-disabled={disabled} className={className}>
      {label && (
        <FieldLabel htmlFor={id || name} className="max-w-max">
          {label}
          {required && <span className="text-primary">*</span>}
        </FieldLabel>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {visibleExisting.map((f) => (
          <div
            key={`existing-${f.url}`}
            className="relative aspect-square overflow-hidden rounded-[2px] border bg-muted/40"
          >
            <img
              src={buildFileUrl(f.url)}
              alt={f.filename || ""}
              className="size-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemoveExisting?.(f.url)}
                className="absolute top-1 right-1 size-6 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="O'chirish"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        ))}

        {newPreviews.map((p, idx) => (
          <div
            key={p.key}
            className="relative aspect-square overflow-hidden rounded-[2px] border bg-muted/40"
          >
            <img src={p.url} alt="" className="size-full object-cover" />
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemoveNew?.(idx)}
                className="absolute top-1 right-1 size-6 grid place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
                aria-label="O'chirish"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        ))}

        {removedUrls.length > 0 && onRestoreExisting && (
          <>
            {existing
              .filter((e) => removedUrls.includes(e.url))
              .map((f) => (
                <button
                  key={`removed-${f.url}`}
                  type="button"
                  onClick={() => onRestoreExisting?.(f.url)}
                  className="relative aspect-square overflow-hidden rounded-[2px] border bg-muted/40 opacity-40 hover:opacity-70"
                  title="Qaytarish"
                >
                  <img
                    src={buildFileUrl(f.url)}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              ))}
          </>
        )}

        <button
          type="button"
          onClick={open}
          disabled={disabled}
          className={cn(
            "aspect-square flex flex-col items-center justify-center gap-1 rounded-[2px] border-2 border-dashed text-muted-foreground",
            "hover:border-primary hover:text-primary transition",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <ImagePlus size={20} />
          <span className="text-[10px]">Rasm qo'shish</span>
        </button>
      </div>

      {error ? (
        <FieldDescription className="text-destructive">{error}</FieldDescription>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}

      <input
        ref={inputRef}
        id={id || name}
        name={name}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
        disabled={disabled}
      />
    </Field>
  );
};

export default InputImages;
