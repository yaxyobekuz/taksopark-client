import {
  LayoutDashboard,
  Wallet,
  Car,
  Users,
  BadgeDollarSign,
  AlertTriangle,
  ShieldAlert,
  CalendarRange,
  BarChart3,
  ArrowLeftRight,
} from "lucide-react";
import { PERMISSIONS } from "@/shared/constants/permissions";

const ownerSidebar = [
  {
    title: "Boshqaruv",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Bosh sahifa", url: "/owner/dashboard" },
      {
        title: "Haydovchilar",
        url: "/owner/drivers",
        permission: PERMISSIONS.DRIVERS_READ,
        icon: Users,
      },
      {
        title: "Mashinalar",
        url: "/owner/cars",
        permission: PERMISSIONS.CARS_READ,
        icon: Car,
      },
    ],
  },
  {
    title: "Moliya",
    icon: Wallet,
    isActive: true,
    items: [
      {
        title: "Kunlik to'lovlar",
        url: "/owner/payments",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: BadgeDollarSign,
      },
      {
        title: "Oylik tsikllar",
        url: "/owner/cycles",
        permission: PERMISSIONS.CYCLES_READ,
        icon: CalendarRange,
      },
      {
        title: "Kirim-Chiqim",
        url: "/owner/transactions",
        permission: PERMISSIONS.TRANSACTIONS_READ,
        icon: ArrowLeftRight,
      },
      {
        title: "Hisobotlar",
        url: "/owner/reports",
        permission: PERMISSIONS.REPORTS_READ,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Jarima & Zarar",
    icon: Wallet,
    isActive: true,
    items: [
      {
        title: "Jarimalar",
        url: "/owner/fines",
        permission: PERMISSIONS.FINES_READ,
        icon: AlertTriangle,
      },
      {
        title: "Zararlar",
        url: "/owner/damages",
        permission: PERMISSIONS.DAMAGES_READ,
        icon: ShieldAlert,
      },
    ],
  },
];

export default ownerSidebar;
