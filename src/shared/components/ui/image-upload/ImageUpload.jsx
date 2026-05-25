import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { cn } from "@/shared/utils/cn";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const ImageUpload = ({
  label = "Rasm",
  value = "",
  file = null,
  onChange,
  disabled = false,
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

  const pick = () => {
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

  const clear = () => {
    setError("");
    onChange?.(null);
  };

  const hasPreview = !!previewUrl;

  return (
    <div className={cn("space-y-1", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={pick}
          disabled={disabled}
          className={cn(
            "relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed",
            "border-muted-foreground/40 bg-muted/40 transition hover:border-primary",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {hasPreview ? (
            <img src={previewUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
              <Camera size={20} />
              <span className="mt-1 text-[10px]">Tanlash</span>
            </div>
          )}
        </button>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={pick}
            disabled={disabled}
          >
            <Upload size={14} className="mr-1" />
            {hasPreview ? "Almashtirish" : "Rasm tanlash"}
          </Button>
          {file instanceof File && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
              disabled={disabled}
            >
              <X size={14} className="mr-1" />
              Bekor qilish
            </Button>
          )}
          <p className="text-xs text-muted-foreground">JPG/PNG/WebP, 5 MB gacha</p>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUpload;
