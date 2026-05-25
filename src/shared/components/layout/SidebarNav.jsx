import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useNavGroups } from "@/shared/hooks/useNavGroups";

const SidebarNav = ({ onItemClick = null, className = "" }) => {
  const groups = useNavGroups();
  const { pathname } = useLocation();

  return (
    <nav className={cn("flex flex-col gap-5", className)}>
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-2 mb-1.5">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.url);
              return (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 hover:bg-muted",
                    )}
                  >
                    {Icon && <Icon size={18} strokeWidth={1.5} />}
                    <span className="flex-1 truncate">{item.title}</span>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
