import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import PermissionGuard from "@/shared/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

import DashboardPage from "@/owner/pages/DashboardPage";
import { CarsListPage } from "@/owner/features/cars";
import { DriversListPage, DriverDetailPage } from "@/owner/features/drivers";
import { PaymentsListPage } from "@/owner/features/payments";
import { FinesListPage } from "@/owner/features/fines";
import { DamagesListPage } from "@/owner/features/damages";
import { CyclesListPage } from "@/owner/features/cycles";
import { TransactionsListPage } from "@/owner/features/transactions";
import {
  DailyPlanReportPage,
  FinanceReportPage,
  DriverStatementPage,
} from "@/owner/features/reports";

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
          <DriverDetailPage />
        </PermissionGuard>
      }
    />

    <Route
      path="payments"
      element={
        <PermissionGuard required={PERMISSIONS.PAYMENTS_READ}>
          <PaymentsListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="fines"
      element={
        <PermissionGuard required={PERMISSIONS.FINES_READ}>
          <FinesListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="damages"
      element={
        <PermissionGuard required={PERMISSIONS.DAMAGES_READ}>
          <DamagesListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="cycles"
      element={
        <PermissionGuard required={PERMISSIONS.CYCLES_READ}>
          <CyclesListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="transactions"
      element={
        <PermissionGuard required={PERMISSIONS.TRANSACTIONS_READ}>
          <TransactionsListPage />
        </PermissionGuard>
      }
    />

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
      <Route path="finance" element={<FinanceReportPage />} />
      <Route path="statement/:driverId" element={<DriverStatementPage />} />
    </Route>

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
