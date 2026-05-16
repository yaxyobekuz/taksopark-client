import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/teacher/pages/DashboardPage";

const TeacherRoutes = () => (
  <Routes>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default TeacherRoutes;
