import { Logo } from "@/components/logo/logo";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-14 flex items-center border-b border-slate-200">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <Button variant="outline">Meu Perfil</Button>
      </div>
    </header>
  )
}