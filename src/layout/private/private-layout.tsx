import { Outlet } from "react-router";
import { Header } from "./header"

export function PrivateLayout() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-0 pt-5 relative">
        <Outlet />
      </main>
    </div>
  );
}