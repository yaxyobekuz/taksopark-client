import useAuth from "@/shared/hooks/useAuth";
import usePermissions from "@/shared/hooks/usePermissions";
import { ROLES } from "@/shared/constants/roles";
import { ownerSidebar } from "@/owner";

const ROLE_SIDEBAR = {
  [ROLES.OWNER]: ownerSidebar,
};

export const useNavGroups = () => {
  const { role } = useAuth();
  const { has } = usePermissions();

  const navItems = ROLE_SIDEBAR[role] || [];

  return navItems
    .map((item) => ({
      ...item,
      items: (item.items || []).filter(
        (sub) => !sub.permission || has(sub.permission),
      ),
    }))
    .filter((item) => item.items.length > 0);
};

export const useFlatNavItems = () => {
  const groups = useNavGroups();
  return groups.flatMap((g) => g.items);
};
