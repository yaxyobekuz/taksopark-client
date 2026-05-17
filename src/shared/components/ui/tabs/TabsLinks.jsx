// Router
import { NavLink, useLocation } from "react-router-dom";

// Utils
import { cn } from "@/shared/utils/cn";

// Components
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/shadcn/tabs";

const resolveActiveValue = (items, pathname) => {
  const exactMatch = items.find((item) =>
    item.exact === false ? false : pathname === item.to,
  );
  if (exactMatch) return exactMatch.to;

  const prefixMatch = [...items]
    .filter((item) => item.exact === false && pathname.startsWith(item.to))
    .sort((a, b) => b.to.length - a.to.length)[0];
  return prefixMatch?.to;
};

const TabsLinks = ({
  items = [],
  className = "",
  listClassName = "",
  triggerClassName = "",
  end = true,
}) => {
  const { pathname } = useLocation();
  if (!items.length) return null;
  const activeValue = resolveActiveValue(items, pathname);

  return (
    <Tabs value={activeValue ?? ""} className={className}>
      <TabsList className={listClassName}>
        {items.map((item) => (
          <TabsTrigger
            asChild
            key={item.to}
            value={item.to}
            disabled={item.disabled}
            className={triggerClassName}
          >
            <NavLink
              to={item.to}
              end={item.exact ?? end}
              aria-disabled={item.disabled || undefined}
              className={cn(item.disabled && "pointer-events-none opacity-50")}
            >
              {item.label}
            </NavLink>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabsLinks;
