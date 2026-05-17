import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";

import PermissionGuard from "@/shared/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

import DashboardPage from "@/owner/pages/DashboardPage";
import { CarsListPage } from "@/owner/features/cars";
import { DriversListPage, DriverDetailPage } from "@/owner/features/drivers";
import {
  PaymentsLayout,
  PaymentsListPage,
  DailyPlanReportPage,
  FinanceReportPage,
  DriverStatementPage,
} from "@/owner/features/payments";
import {
  PenaltiesLayout,
  FinesListPage,
  DamagesListPage,
} from "@/owner/features/penalties";
import { CyclesListPage } from "@/owner/features/cycles";
import { TransactionsListPage } from "@/owner/features/transactions";

const NavigateStatement = () => {
  const { driverId } = useParams();
  return <Navigate to={`/owner/payments/reports/statement/${driverId}`} replace />;
};

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
        <Route path="finance" element={<FinanceReportPage />} />
        <Route path="statement/:driverId" element={<DriverStatementPage />} />
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

    <Route path="reports" element={<Navigate to="/owner/payments/reports" replace />} />
    <Route path="reports/daily-plan" element={<Navigate to="/owner/payments/reports/daily-plan" replace />} />
    <Route path="reports/finance" element={<Navigate to="/owner/payments/reports/finance" replace />} />
    <Route path="reports/statement/:driverId" element={<NavigateStatement />} />

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
