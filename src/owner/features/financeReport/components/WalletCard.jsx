import { useNavigate } from "react-router-dom";
import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";
import { TRANSACTION_WALLET_LABELS } from "@/shared/constants/payments";
import { cn } from "@/shared/utils/cn";

const TONE = {
  deposit: { ring: "border-blue-200", bg: "bg-blue-50", text: "text-blue-700" },
  debt: { ring: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  revenue: {
    ring: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  external: {
    ring: "border-slate-200",
    bg: "bg-slate-50",
    text: "text-slate-700",
  },
};

const WalletCard = ({ wallet, data }) => {
  const navigate = useNavigate();
  const tone = TONE[wallet] || TONE.external;
  const closing = data?.closingBalance ?? 0;
  const opening = data?.openingBalance ?? 0;
  const incTotal = data?.in ?? 0;
  const outTotal = data?.out ?? 0;
  const net = data?.net ?? 0;

  return (
    <button
      type="button"
      className={cn("group text-left w-full relative pt-10")}
      onClick={() => navigate(`/owner/finance-report/${wallet}`)}
    >
      <Card className="absolute w-[88%] h-8 top-2 rounded-t-xl bg-gradient-to-b from-white via-white to-gray-100 translate-x-0 duration-200 group-hover:top-0" />

      <Card
        className={cn("relative space-y-6 mr-4 rounded-xl rounded-tl-none")}
      >
        <h3 className="font-semibold text-gray-900">
          {TRANSACTION_WALLET_LABELS[wallet]}
        </h3>

        <div>
          <div className="text-xs text-muted-foreground">Davr oxiri</div>
          <div
            className={cn(
              "text-2xl font-bold",
              net >= 0 ? "text-gray-900" : "text-red-600",
            )}
          >
            {formatMoney(closing)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Boshlanish</div>
            <div className="font-medium">{formatMoney(opening)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Kirim</div>
            <div className="font-medium text-emerald-700">
              +{formatMoney(incTotal)}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Chiqim</div>
            <div className="font-medium text-red-700">
              −{formatMoney(outTotal)}
            </div>
          </div>
        </div>

        {/*  Tasma */}
        <div
          className={cn(
            "flex items-center absolute top-[calc(50%-32px)] -right-3 w-20 h-16 bg-white border pl-6 !m-0 rounded-l-xl rounded-r-md transition-all group-hover:w-16",
          )}
        >
          {/* Circle */}
          <div className="size-4 rounded-full bg-primary" />
        </div>
      </Card>
    </button>
  );
};

export default WalletCard;
