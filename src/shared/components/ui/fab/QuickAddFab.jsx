import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const RADIUS = 90;

const QuickAddFab = ({ actions = [] }) => {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY < 80;
      setAtTop(top);
      if (!top) setOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (actions.length === 0) return null;

  const handleAction = (onClick) => {
    setOpen(false);
    onClick();
  };

  const toggle = () => {
    setOpen((v) => !v);
  };

  const offsetFor = (i) => {
    if (!open) return { x: 0, y: 0 };
    const step = actions.length > 1 ? 90 / (actions.length - 1) : 0;
    const rad = (step * i * Math.PI) / 180;
    return {
      x: -Math.sin(rad) * RADIUS,
      y: -Math.cos(rad) * RADIUS,
    };
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 transition-all duration-300 !m-0",
        atTop
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      {/* Planeta amallar - markaziy tugma ustida absolyut joylashadi */}
      {actions.map(({ key, label, icon: Icon, onClick }, i) => {
        const { x, y } = offsetFor(i);
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleAction(onClick)}
            aria-label={label}
            title={label}
            className={cn(
              "absolute bottom-1 right-1 flex items-center justify-center size-11 rounded-full bg-white border shadow-md text-primary transition-all duration-300 ease-out",
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50 pointer-events-none",
            )}
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transitionDelay: open ? `${i * 40}ms` : "0ms",
            }}
          >
            <Icon size={20} />
          </button>
        );
      })}

      {/* Asosiy tugma (quyosh) */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Tezkor qo'shish"
        aria-expanded={open}
        className="relative flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
      >
        <span
          className={cn(
            "transition-transform duration-300",
            open && "rotate-[135deg]",
          )}
        >
          {open ? <X size={24} /> : <Plus size={24} />}
        </span>
      </button>
    </div>
  );
};

export default QuickAddFab;
