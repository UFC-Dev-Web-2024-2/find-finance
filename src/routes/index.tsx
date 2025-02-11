import { PublicLayout } from "@/layout/public/public-layout";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { Navigate, Route, Routes as RoutesReactRouter } from "react-router";
import { LoginPage } from "@/pages/public/login";
import { DashboardPage } from "@/pages/private/dashboard";
import { PrivateLayout } from "@/layout/private/private-layout";
import { SavingsPage } from "@/pages/private/savings";
import { Toaster } from "@/components/ui/toaster";

export function Routes() {
  return (
    <ExpenseProvider>
      <Toaster/>
      <RoutesReactRouter>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route index path="login" element={<LoginPage />} />
        </Route>

        <Route path="/" element={<PrivateLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="savings" element={<SavingsPage />} />
        </Route>
      </RoutesReactRouter>
    </ExpenseProvider>
  );
}
