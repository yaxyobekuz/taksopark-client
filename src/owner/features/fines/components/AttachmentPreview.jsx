import { Eye } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

const AttachmentPreview = ({ attachments = [] }) => {
  if (!attachments.length) return <span className="text-muted-foreground">—</span>;

  const handleView = () => {
    attachments.forEach((a) => {
      window.open(`${API_BASE}${a.url}`, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <button
      type="button"
      onClick={handleView}
      className="inline-flex items-center gap-1.5 text-primary hover:underline"
      title="Hujjatlarni ko'rish"
    >
      <Eye size={14} />
      Ko'rish
      <span className="text-xs text-muted-foreground">({attachments.length})</span>
    </button>
  );
};

export default AttachmentPreview;
