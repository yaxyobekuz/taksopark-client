// Utils
import { cn } from "@/shared/utils/cn";

// React
import { cloneElement, useState } from "react";

// Hooks
import useModal from "@/shared/hooks/useModal";
import useMediaQuery from "@/shared/hooks/useMediaQuery";

// Ui components
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/shared/components/shadcn/dialog";
import { Drawer, DrawerContent } from "@/shared/components/shadcn/drawer";

const ModalWrapper = ({
  children,
  footer = null,
  name = "",
  className = "",
  description = "",
  title = "Modal sarlavhasi",
}) => {
  const { closeModal, isOpen, data } = useModal(name);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 480px)");
  const hanldeCloseModal = (data) => !isLoading && closeModal(name, data);

  const injectedProps = {
    isLoading,
    setIsLoading,
    close: hanldeCloseModal,
    ...(data || {}),
  };

  const body = cloneElement(children, injectedProps);
  const footerNode = footer ? cloneElement(footer, injectedProps) : null;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={hanldeCloseModal}>
        <DialogContent className={cn("max-w-md", className)}>
          {/* Header */}
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Body */}
          {body}

          {/* Footer */}
          {footerNode && <div className="pt-2">{footerNode}</div>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={hanldeCloseModal}>
      <DrawerContent className={cn("px-5 pb-5", className)}>
        {/* Header */}
        <DialogHeader className="bg-white pb-3.5">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Body */}
        <div
          className={cn(
            "w-full overflow-y-auto hidden-scroll",
            footerNode
              ? "max-h-[calc(100vh-220px)]"
              : "max-h-[calc(100vh-154px)]",
          )}
        >
          {body}
        </div>

        {/* Footer */}
        {footerNode && (
          <div className="sticky bottom-0 bg-white border-t pt-3 mt-2 -mx-5 px-5">
            {footerNode}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ModalWrapper;
