import { Outlet } from "react-router";
import { Header } from "./header";
import { UserLoggedProvider } from "@/context/UserLoggedContext";
import { ExpenseProvider } from "@/context/ExpenseContext";

export function PrivateLayout() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-0 pt-5 relative">
        <UserLoggedProvider>
          <ExpenseProvider>
            <Outlet />
          </ExpenseProvider>
        </UserLoggedProvider>
      </main>
    </div>
  );
}
