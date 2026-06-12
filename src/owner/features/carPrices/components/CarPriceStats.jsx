import { CalendarRange, Layers, CircleDollarSign } from "lucide-react";

import StatCard from "@/shared/components/ui/card/StatCard";
import {
  periodState,
  totalCoverageDays,
  formatDuration,
} from "../utils/carPrice.utils";

// 3ta card: jami narx sozlangan muddat, davrlar soni, faol davr (§03).
const CarPriceStats = ({ periods = [] }) => {
  const total = totalCoverageDays(periods);
  const activeCount = periods.filter((p) => periodState(p) === "active").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Jami narx sozlangan"
        value={total}
        suffix=" kun"
        hint={formatDuration(total)}
        icon={CalendarRange}
      />
      <StatCard
        label="Narx davrlari"
        value={periods.length}
        suffix=" ta"
        icon={Layers}
        tone="info"
      />
      <StatCard
        label="Faol davr"
        value={activeCount}
        suffix=" ta"
        icon={CircleDollarSign}
        tone={activeCount ? "positive" : "default"}
      />
    </div>
  );
};

export default CarPriceStats;
