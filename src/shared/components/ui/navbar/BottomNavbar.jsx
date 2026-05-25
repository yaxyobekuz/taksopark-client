import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Car, Menu } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/shadcn/sheet";
import SidebarNav from "@/shared/components/layout/SidebarNav";

const PRIMARY_PATHS = ["/owner/dashboard", "/owner/drivers", "/owner/cars"];

const PRIMARY_ITEMS = [
  { path: "/owner/dashboard", label: "Asosiy", icon: Home },
  { path: "/owner/drivers", label: "Haydovchilar", icon: Users },
  { path: "/owner/cars", label: "Mashinalar", icon: Car },
];

const BottomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const menuActive = !PRIMARY_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t md:hidden">
        <div className="grid grid-cols-4">
          {PRIMARY_ITEMS.map((it) => (
            <NavLink
              key={it.path}
              to={it.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-gray-900",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <it.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={cn(isActive && "font-semibold")}>
                    {it.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
              menuActive
                ? "text-primary"
                : "text-muted-foreground hover:text-gray-900",
            )}
          >
            <Menu size={20} strokeWidth={menuActive ? 2 : 1.5} />
            <span className={cn(menuActive && "font-semibold")}>Menyu</span>
          </button>
        </div>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-xl"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Menyu</SheetTitle>
          </SheetHeader>
          <div className="mt-3">
            <SidebarNav onItemClick={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default BottomNavbar;
