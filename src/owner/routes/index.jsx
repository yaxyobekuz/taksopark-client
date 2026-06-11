import { Routes, Route, Navigate } from "react-router-dom";

import PermissionGuard from "@/shared/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

import DashboardPage from "@/owner/pages/DashboardPage";
import {
  CarsListPage,
  CarDetailLayout,
  CarOverviewPage,
  CarEditPage,
} from "@/owner/features/cars";
import {
  DriversListPage,
  DriverDetailLayout,
  DriverOverviewPage,
  DriverFinesPage,
  DriverDamagesPage,
  DriverWorkDaysPage,
} from "@/owner/features/drivers";
import { RestDaysListPage } from "@/owner/features/restdays";
import {
  PenaltiesLayout,
  FinesListPage,
  DamagesListPage,
} from "@/owner/features/penalties";
import { AdminsListPage, AdminDetailPage } from "@/owner/features/admins";
import { CarDocumentTypesPage } from "@/owner/features/carDocumentTypes";
import { DriverDocumentTypesPage } from "@/owner/features/driverDocumentTypes";

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
        path="tahrirlash"
        element={
          <PermissionGuard required={PERMISSIONS.CARS_UPDATE}>
            <CarEditPage />
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
        path="work-days"
        element={
          <PermissionGuard required={PERMISSIONS.REST_DAYS_READ}>
            <DriverWorkDaysPage />
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
    </Route>

    <Route
      path="rest-days"
      element={
        <PermissionGuard required={PERMISSIONS.REST_DAYS_READ}>
          <RestDaysListPage />
        </PermissionGuard>
      }
    />

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
      path="admins"
      element={
        <PermissionGuard required={PERMISSIONS.ADMINS_READ}>
          <AdminsListPage />
        </PermissionGuard>
      }
    />
    <Route
      path="admins/:id"
      element={
        <PermissionGuard required={PERMISSIONS.ADMINS_READ}>
          <AdminDetailPage />
        </PermissionGuard>
      }
    />
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

    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default OwnerRoutes;
