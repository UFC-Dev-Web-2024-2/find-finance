import { PublicLayout } from "@/layout/public/public-layout";
import { Navigate, Route, Routes as RoutesReactRouter } from "react-router";
import { LoginPage } from "@/pages/public/login";
import { RegisterPage } from "@/pages/public/register"
import { ForgotPasswordPage } from "@/pages/public/forgot-password";
import { CodeConfirmationPage } from "@/pages/public/forgot-password/code-confirmation";
import { CreateNewPasswordPage } from "@/pages/public/forgot-password/create-new-password";
import { EmailConfirmationPage } from "@/pages/public/register/email-confirmation";
import { AccountConfirmationStatusPage } from "@/pages/public/register/account-confirmation-status";

export function Routes() {
  return (
    <RoutesReactRouter>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route index path="login" element={<LoginPage />} />
        <Route index path ="register" element={<RegisterPage/>} />
        <Route path="register/email-confirmation" element={<EmailConfirmationPage/>}/>
        <Route path="register/account-confirmation-status" element={<AccountConfirmationStatusPage/>}/>
        <Route index path="forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="forgot-password/code-confirmation" element={<CodeConfirmationPage/>}/>
        <Route path="forgot-password/create-new-password" element={<CreateNewPasswordPage/>} />
      </Route>

      <Route path="dashboard" element={<h1>Dashboard</h1>} />
    </RoutesReactRouter>
  );
}
