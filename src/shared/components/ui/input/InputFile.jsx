import { useEffect, useMemo, useRef, useState } from "react";
import {
  CloudUpload,
  Eye,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

const TYPE_VISUALS = [
  {
    test: (f) => f.type.startsWith("image/"),
    icon: FileImage,
    color: "text-sky-600",
    previewable: true,
  },
  {
    test: (f) => f.type === "application/pdf",
    icon: FileText,
    color: "text-red-600",
    previewable: true,
  },
  {
    test: (f) => f.type.startsWith("video/"),
    icon: FileVideo,
    color: "text-violet-600",
    previewable: true,
  },
  {
    test: (f) => f.type.startsWith("audio/"),
    icon: FileAudio,
    color: "text-amber-600",
  },
  {
    test: (f) =>
      /zip|rar|7z|tar|gzip|compressed/.test(f.type) ||
      /\.(zip|rar|7z|tar|gz)$/i.test(f.name),
    icon: FileArchive,
    color: "text-orange-600",
  },
  {
    test: (f) =>
      /sheet|excel|csv/.test(f.type) || /\.(xlsx?|csv)$/i.test(f.name),
    icon: FileSpreadsheet,
    color: "text-green-600",
  },
  {
    test: (f) => /word|msword/.test(f.type) || /\.(docx?)$/i.test(f.name),
    icon: FileText,
    color: "text-blue-600",
  },
];

const visualFor = (file) =>
  TYPE_VISUALS.find((v) => v.test(file)) || {
    icon: FileIcon,
    color: "text-muted-foreground",
  };

const ACCEPT_LABELS = {
  "image/*": "Rasm",
  "application/pdf": "PDF",
  ".pdf": "PDF",
  "video/*": "Video",
  "audio/*": "Audio",
};

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const fileKey = (f) => `${f.name}-${f.size}-${f.lastModified}`;

const matchesAccept = (file, accept) => {
  if (!accept) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith(".")) return name.endsWith(rule);
      if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
};

const InputFile = ({
  id = "",
  name = "",
  files = [],
  onChange,
  accept = "",
  multiple = false,
  maxFiles = 10,
  maxSizeMB = 20,
  capture,
  disabled = false,
  placeholder = "",
  className = "",
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const previews = useMemo(
    () =>
      files.map((f) => {
        const v = visualFor(f);
        const url =
          v.previewable && f instanceof File ? URL.createObjectURL(f) : "";
        return { file: f, key: fileKey(f), url, ...v };
      }),
    [files],
  );

  useEffect(() => {
    return () => {
      for (const p of previews) if (p.url) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  const acceptHint = useMemo(() => {
    const types = accept
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => ACCEPT_LABELS[r.toLowerCase()] || r.replace(/^\./, "").toUpperCase());
    const parts = [];
    if (types.length) parts.push(types.join(", "));
    parts.push(`max ${maxSizeMB} MB`);
    if (multiple) parts.push(`max ${maxFiles} ta`);
    return parts.join(" · ");
  }, [accept, maxSizeMB, maxFiles, multiple]);

  const open = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const addFiles = (picked) => {
    if (!picked.length || disabled) return;
    const reasons = new Set();
    const existingKeys = new Set(files.map(fileKey));
    const accepted = [];

    for (const f of picked) {
      if (!matchesAccept(f, accept)) {
        reasons.add("fayl turi mos emas");
        continue;
      }
      if (f.size > maxSizeMB * 1024 * 1024) {
        reasons.add(`hajmi ${maxSizeMB} MB dan katta`);
        continue;
      }
      if (existingKeys.has(fileKey(f))) {
        reasons.add("allaqachon tanlangan");
        continue;
      }
      existingKeys.add(fileKey(f));
      accepted.push(f);
    }

    let next;
    if (multiple) {
      const room = maxFiles - files.length;
      if (accepted.length > room) reasons.add(`maksimum ${maxFiles} ta fayl`);
      next = [...files, ...accepted.slice(0, Math.max(0, room))];
    } else {
      next = accepted.length ? [accepted[0]] : files;
    }

    setError(
      reasons.size ? `Ba'zi fayllar qabul qilinmadi: ${[...reasons].join(", ")}` : "",
    );
    if (next !== files) onChange?.(next);
  };

  const handleSelect = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    addFiles(picked);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer?.files || []));
  };

  const removeAt = (idx) => {
    setError("");
    onChange?.(files.filter((_, i) => i !== idx));
  };

  const previewFile = (p) => {
    if (p.url) window.open(p.url, "_blank", "noopener");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={open}
        disabled={disabled}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 rounded-[2px] border-2 border-dashed bg-white px-3 py-5 text-center",
          "transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging && "border-primary bg-primary/5",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <CloudUpload
          size={22}
          className={cn("text-muted-foreground", dragging && "text-primary")}
        />
        <span className="text-sm font-medium">
          {placeholder ||
            (files.length && !multiple
              ? "Faylni almashtirish"
              : "Fayl tanlang yoki shu yerga tashlang")}
        </span>
        <span className="text-xs text-muted-foreground">{acceptHint}</span>
      </button>

      {previews.length > 0 && (
        <ul className="space-y-1.5">
          {previews.map((p, idx) => {
            const Icon = p.icon;
            return (
              <li
                key={p.key}
                className="flex items-center gap-2.5 rounded-[2px] border bg-white p-1.5 pr-2"
              >
                <div className="size-10 shrink-0 grid place-items-center overflow-hidden rounded-[2px] border bg-muted/40">
                  {p.url && p.file.type.startsWith("image/") ? (
                    <img
                      src={p.url}
                      alt={p.file.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Icon size={18} className={p.color} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(p.file.size)}
                  </p>
                </div>

                {p.url && (
                  <button
                    type="button"
                    onClick={() => previewFile(p)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                    aria-label="Ko'rish"
                  >
                    <Eye size={16} strokeWidth={1.5} />
                  </button>
                )}

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
                    aria-label="O'chirish"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        id={id || name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        onChange={handleSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default InputFile;
