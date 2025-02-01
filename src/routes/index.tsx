import { PublicLayout } from "@/layout/public/public-layout";
import { Navigate, Route, Routes as RoutesReactRouter } from "react-router";
import { LoginPage } from "@/pages/public/login";

export function Routes() {
  return (
    <RoutesReactRouter>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route index path="login" element={<LoginPage />} />
      </Route>

      <Route path="dashboard" element={<h1>Dashboard</h1>} />
    </RoutesReactRouter>
  );
}
