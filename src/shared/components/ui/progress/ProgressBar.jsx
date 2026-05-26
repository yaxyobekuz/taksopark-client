import { cn } from "@/shared/utils/cn";

const TONE_CLASS = {
  success: "bg-emerald-500",
  default: "bg-blue-500",
  warn: "bg-amber-500",
  danger: "bg-red-500",
};

const pickTone = (value) => {
  if (value >= 100) return "success";
  if (value >= 60) return "default";
  if (value >= 30) return "warn";
  return "danger";
};

const ProgressBar = ({ value = 0, tone, className = "", trackClassName = "" }) => {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const finalTone = tone || pickTone(clamped);
  return (
    <div
      className={cn(
        "w-full h-2 rounded-full bg-gray-100 overflow-hidden",
        trackClassName,
        className,
      )}
    >
      <div
        className={cn("h-full transition-all", TONE_CLASS[finalTone] || TONE_CLASS.default)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export default ProgressBar;
