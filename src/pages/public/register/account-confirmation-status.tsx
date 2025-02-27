import { LogoIcon } from "@/components/logo/logo-icon";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AccountConfirmationStatusPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <main className="flex flex-col items-center gap-8">
      <LogoIcon />
      <div className="space-y-2">
        <h1 className="text-center h1 w-[250px]">Conta verificada com sucesso</h1>
      </div>
    </main>
  );
}
