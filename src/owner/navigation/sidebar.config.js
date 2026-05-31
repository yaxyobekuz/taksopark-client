import {
  LayoutDashboard,
  Wallet,
  Car,
  Users,
  BadgeDollarSign,
  AlertTriangle,
  CalendarRange,
  CalendarOff,
  ArrowLeftRight,
  Settings,
  FileType,
  Tags,
  ShieldCheck,
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
    isActive: true,
    items: [
      {
        title: "To'lovlar",
        url: "/owner/payments",
        permission: PERMISSIONS.PAYMENTS_READ,
        icon: BadgeDollarSign,
      },
      {
        title: "Oyliklar",
        url: "/owner/oyliklar",
        permission: PERMISSIONS.OYLIKLAR_READ,
        icon: CalendarRange,
      },
      {
        title: "Kirim-Chiqim",
        url: "/owner/transactions",
        permission: PERMISSIONS.TRANSACTIONS_READ,
        icon: ArrowLeftRight,
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
      {
        title: "Tranzaksiya kategoriyalari",
        url: "/owner/settings/transaction-categories",
        permission: PERMISSIONS.TRANSACTIONS_CATEGORIES_MANAGE,
        icon: Tags,
      },
    ],
  },
];

export default ownerSidebar;
