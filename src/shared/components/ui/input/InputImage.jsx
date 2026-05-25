import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/shadcn/field";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { cn } from "@/shared/utils/cn";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const InputImage = ({
  id = "",
  name = "",
  label = "",
  description = "JPG, PNG yoki WebP, 5 MB gacha",
  value = "",
  file = null,
  onChange,
  disabled = false,
  required = false,
  className = "",
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (file instanceof File) return URL.createObjectURL(file);
    return buildFileUrl(value);
  }, [file, value]);

  useEffect(() => {
    if (file instanceof File && previewUrl) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [file, previewUrl]);

  const open = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Faqat rasm fayllari qabul qilinadi");
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError("Rasm hajmi 5 MB dan oshmasligi kerak");
      return;
    }
    setError("");
    onChange?.(f);
  };

  const clear = (e) => {
    e.stopPropagation();
    setError("");
    onChange?.(null);
  };

  const hasPreview = !!previewUrl;

  return (
    <Field data-disabled={disabled} className={className}>
      {label && (
        <FieldLabel htmlFor={id || name} className="max-w-max">
          {label}
          {required && <span className="text-primary">*</span>}
        </FieldLabel>
      )}
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        className={cn(
          "relative flex items-center gap-3 w-full rounded-md border border-input bg-background p-2 text-left",
          "transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <div className="size-16 shrink-0 overflow-hidden rounded border bg-muted/40 flex items-center justify-center">
          {hasPreview ? (
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus size={20} className="text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-sm">
          <p className="font-medium truncate">
            {hasPreview ? "Rasmni almashtirish" : "Rasm tanlash"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {file instanceof File ? file.name : hasPreview ? "Joriy rasm" : "Fayl tanlanmagan"}
          </p>
        </div>
        {file instanceof File && !disabled && (
          <span
            role="button"
            tabIndex={0}
            onClick={clear}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && clear(e)}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Tanlovni bekor qilish"
          >
            <X size={14} />
          </span>
        )}
      </button>
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
        onChange={handleSelect}
        className="hidden"
        disabled={disabled}
      />
    </Field>
  );
};

export default InputImage;
