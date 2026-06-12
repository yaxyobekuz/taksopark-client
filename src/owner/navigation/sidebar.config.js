import {
  LayoutDashboard,
  Car,
  Users,
  AlertTriangle,
  CalendarOff,
  Settings,
  FileType,
  ShieldCheck,
  Wallet,
  FileBarChart,
  RotateCcw,
  PiggyBank,
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
      {
        title: "Jarima & Zarar",
        url: "/owner/penalties",
        permission: PERMISSIONS.FINES_READ,
        icon: AlertTriangle,
      },
      {
        title: "Dam olish kunlari",
        url: "/owner/rest-days",
        permission: PERMISSIONS.REST_DAYS_READ,
        icon: CalendarOff,
      },
    ],
  },
  {
    title: "Moliya",
    icon: Wallet,
    isActive: false,
    items: [
      {
        title: "Hisobotlar",
        url: "/owner/finance/reports",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: FileBarChart,
      },
      {
        title: "Kunlik to'lovlar",
        url: "/owner/finance/payments",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: Wallet,
      },
      {
        title: "Keshbeklar",
        url: "/owner/finance/cashbacks",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: RotateCcw,
      },
      {
        title: "Depozitlar",
        url: "/owner/finance/deposits",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: PiggyBank,
      },
    ],
  },
  {
    title: "Sozlamalar",
    icon: Settings,
    isActive: false,
    items: [
      {
        title: "Adminlar",
        url: "/owner/admins",
        permission: PERMISSIONS.ADMINS_READ,
        icon: ShieldCheck,
      },
      {
        title: "Mashina hujjat turlari",
        url: "/owner/settings/car-documents",
        permission: PERMISSIONS.CARS_DOCUMENTS_MANAGE,
        icon: FileType,
      },
      {
        title: "Haydovchi hujjat turlari",
        url: "/owner/settings/driver-documents",
        permission: PERMISSIONS.DRIVERS_DOCUMENTS_MANAGE,
        icon: FileType,
      },
    ],
  },
];

export default ownerSidebar;
