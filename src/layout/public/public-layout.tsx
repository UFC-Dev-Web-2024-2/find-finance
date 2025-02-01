import { Outlet } from "react-router";
import { Header } from "./header";

export function PublicLayout() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-20 pt-14 relative">
        <Outlet />
      </main>
    </div>
  );
}