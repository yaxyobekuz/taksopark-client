// Components
import {
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Tooltip as TooltipComponent,
} from "../../shadcn/tooltip";

const Tooltip = ({ children, content, side = "top", align = "center" }) => {
  if (!content) return children;
  return (
    <TooltipProvider delayDuration={150}>
      <TooltipComponent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  );
};

export default Tooltip;
