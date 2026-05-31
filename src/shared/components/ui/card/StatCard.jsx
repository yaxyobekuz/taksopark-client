// Utils
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";

// Components
import Card from "@/shared/components/ui/card/Card";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";

const StatCard = ({
  hint,
  label,
  value,
  icon: Icon,
  suffix = "",
  isMoney = false,
  tone = "default",
}) => {
  // Ranglar faqat raqam va ikonkada - fon doim oq, kartochka jiddiy ko'rinsin.
  const valueTone = {
    default: "text-foreground",
    positive: "text-emerald-600",
    negative: "text-rose-600",
    info: "text-blue-600",
    warn: "text-amber-600",
  }[tone];

  const iconTone = {
    default: "text-zinc-500",
    positive: "text-emerald-600",
    negative: "text-rose-600",
    info: "text-blue-600",
    warn: "text-amber-600",
  }[tone];

  const iconBg = {
    default: "bg-muted",
    positive: "bg-emerald-50",
    negative: "bg-rose-50",
    info: "bg-blue-50",
    warn: "bg-amber-50",
  }[tone];

  const safeValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-600">{label}</p>

          <p
            className={cn(
              "text-2xl font-semibold tracking-tight mt-1.5",
              valueTone,
            )}
          >
            {value === null || value === undefined ? (
              <span className="text-zinc-400">-</span>
            ) : (
              <AnimatedCounter
                value={safeValue}
                formatter={isMoney ? formatMoney : undefined}
                suffix={suffix}
              />
            )}
          </p>

          {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
        </div>

        {Icon && (
          <span
            className={cn(
              "flex items-center justify-center size-11 rounded-full shrink-0",
              iconBg,
            )}
          >
            <Icon className={cn("size-5", iconTone)} />
          </span>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
