import { PublicLayout } from "@/layout/public/public-layout";
import { ExpenseProvider } from "@/context/ExpenseContext";
import { Navigate, Route, Routes as RoutesReactRouter } from "react-router";
import { LoginPage } from "@/pages/public/login";
import { RegisterPage } from "@/pages/public/register"
import { ForgotPasswordPage } from "@/pages/public/forgot-password";
import { CodeConfirmationPage } from "@/pages/public/forgot-password/code-confirmation";
import { CreateNewPasswordPage } from "@/pages/public/forgot-password/create-new-password";
import { EmailConfirmationPage } from "@/pages/public/register/email-confirmation";
import { AccountConfirmationStatusPage } from "@/pages/public/register/account-confirmation-status";
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
          <Route index path ="register" element={<RegisterPage/>} />
          <Route path="register/email-confirmation/:code" element={<EmailConfirmationPage/>}/>
          <Route path="register/account-confirmation-status" element={<AccountConfirmationStatusPage/>}/>
          <Route index path="forgot-password" element={<ForgotPasswordPage/>}/>
          <Route path="forgot-password/code-confirmation/:email" element={<CodeConfirmationPage/>}/>
          <Route path="forgot-password/create-new-password/:email" element={<CreateNewPasswordPage/>} />
        </Route>
        
        <Route path="/" element={<PrivateLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="savings" element={<SavingsPage />} />
        </Route>
      </RoutesReactRouter>
    </ExpenseProvider>
  );
}