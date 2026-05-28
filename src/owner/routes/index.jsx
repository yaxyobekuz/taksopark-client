import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import PermissionGuard from "@/shared/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

import DashboardPage from "@/owner/pages/DashboardPage";
import {
  CarsListPage,
  CarDetailLayout,
  CarOverviewPage,
  CarFinancePage,
} from "@/owner/features/cars";
import {
  DriversListPage,
  DriverDetailLayout,
  DriverOverviewPage,
  DriverPaymentsPage,
  DriverFinesPage,
  DriverDamagesPage,
  DriverOyliklarPage,
} from "@/owner/features/drivers";
import {
  PaymentsLayout,
  PaymentsListPage,
  DailyPlanReportPage,
  MonthlyPlanReportPage,
  FinanceReportPage,
} from "@/owner/features/payments";
import {
  PenaltiesLayout,
  FinesListPage,
  DamagesListPage,
} from "@/owner/features/penalties";
import { OyliklarListPage } from "@/owner/features/oyliklar";
import { TransactionsListPage } from "@/owner/features/transactions";
import { CarDocumentTypesPage } from "@/owner/features/carDocumentTypes";
import { DriverDocumentTypesPage } from "@/owner/features/driverDocumentTypes";
import { TransactionCategoriesPage } from "@/owner/features/transactionCategories";

const OwnerRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />

    <Route
      path="cars"
      element={
        <PermissionGuard required={PERMISSIONS.CARS_READ}>
          <CarsListPage />
        </PermissionGuard>
      }
    />
    <Route
      path="cars/:id"
      element={
        <PermissionGuard required={PERMISSIONS.CARS_READ}>
          <CarDetailLayout />
        </PermissionGuard>
      }
    >
      <Route index element={<CarOverviewPage />} />
      <Route
        path="moliya"
        element={
          <PermissionGuard required={PERMISSIONS.REPORTS_READ}>
            <CarFinancePage />
          </PermissionGuard>
        }
      />
    </Route>

    <Route
      path="drivers"
      element={
        <PermissionGuard required={PERMISSIONS.DRIVERS_READ}>
          <DriversListPage />
        </PermissionGuard>
      }
    />
    <Route
      path="drivers/:id"
      element={
        <PermissionGuard required={PERMISSIONS.DRIVERS_READ}>
          <DriverDetailLayout />
        </PermissionGuard>
      }
    >
      <Route index element={<DriverOverviewPage />} />
      <Route
        path="payments"
        element={
          <PermissionGuard required={PERMISSIONS.PAYMENTS_READ}>
            <DriverPaymentsPage />
          </PermissionGuard>
        }
      />
      <Route
        path="fines"
        element={
          <PermissionGuard required={PERMISSIONS.FINES_READ}>
            <DriverFinesPage />
          </PermissionGuard>
        }
      />
      <Route
        path="damages"
        element={
          <PermissionGuard required={PERMISSIONS.DAMAGES_READ}>
            <DriverDamagesPage />
          </PermissionGuard>
        }
      />
      <Route
        path="oyliklar"
        element={
          <PermissionGuard required={PERMISSIONS.OYLIKLAR_READ}>
            <DriverOyliklarPage />
          </PermissionGuard>
        }
      />
      <Route path="cycles" element={<Navigate to="../oyliklar" replace />} />
    </Route>

    <Route
      path="payments"
      element={
        <PermissionGuard required={PERMISSIONS.PAYMENTS_READ}>
          <PaymentsLayout />
        </PermissionGuard>
      }
    >
      <Route index element={<PaymentsListPage />} />
      <Route
        path="reports"
        element={
          <PermissionGuard required={PERMISSIONS.REPORTS_READ}>
            <Outlet />
          </PermissionGuard>
        }
      >
        <Route index element={<Navigate to="daily-plan" replace />} />
        <Route path="daily-plan" element={<DailyPlanReportPage />} />
        <Route path="monthly-plan" element={<MonthlyPlanReportPage />} />
        <Route path="finance" element={<FinanceReportPage />} />
      </Route>
    </Route>

    <Route
      path="penalties"
      element={
        <PermissionGuard required={PERMISSIONS.FINES_READ}>
          <PenaltiesLayout />
        </PermissionGuard>
      }
    >
      <Route index element={<FinesListPage />} />
      <Route
        path="damages"
        element={
          <PermissionGuard required={PERMISSIONS.DAMAGES_READ}>
            <DamagesListPage />
          </PermissionGuard>
        }
      />
    </Route>

    <Route path="fines" element={<Navigate to="/owner/penalties" replace />} />
    <Route path="damages" element={<Navigate to="/owner/penalties/damages" replace />} />

    <Route
      path="oyliklar"
      element={
        <PermissionGuard required={PERMISSIONS.OYLIKLAR_READ}>
          <OyliklarListPage />
        </PermissionGuard>
      }
    />
    <Route path="cycles" element={<Navigate to="/owner/oyliklar" replace />} />

    <Route
      path="transactions"
      element={
        <PermissionGuard required={PERMISSIONS.TRANSACTIONS_READ}>
          <TransactionsListPage />
        </PermissionGuard>
      }
    />

    <Route path="reports" element={<Navigate to="/owner/payments/reports" replace />} />
    <Route path="reports/daily-plan" element={<Navigate to="/owner/payments/reports/daily-plan" replace />} />
    <Route path="reports/finance" element={<Navigate to="/owner/payments/reports/finance" replace />} />

    <Route
      path="settings/car-documents"
      element={
        <PermissionGuard required={PERMISSIONS.CARS_DOCUMENTS_MANAGE}>
          <CarDocumentTypesPage />
        </PermissionGuard>
      }
    />
    <Route
      path="settings/driver-documents"
      element={
        <PermissionGuard required={PERMISSIONS.DRIVERS_DOCUMENTS_MANAGE}>
          <DriverDocumentTypesPage />
        </PermissionGuard>
      }
    />
    <Route
      path="settings/transaction-categories"
      element={
        <PermissionGuard required={PERMISSIONS.TRANSACTIONS_CATEGORIES_MANAGE}>
          <TransactionCategoriesPage />
        </PermissionGuard>
      }
    />

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
