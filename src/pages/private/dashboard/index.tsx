

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DashboardPage() {

  return (
    <>
      <h1>Dashboard</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Novo Registro</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Novo Registro</DialogTitle>
            <DialogDescription>
              Adicione um Registro de despesa ou ganho.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <Label htmlFor="title" className="text-left">Título</Label>
                <Input id="title" defaultValue="Titulo"></Input>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="register-type" className="text-left">Tipo de Registro</Label>
                <Select>
                  <SelectTrigger id="register-type" className="w-[280px]">
                    <SelectValue placeholder="Selecione um Registro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Selecione um Registro</SelectLabel>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Ganho</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="description" className="text-left">Descrição</Label>
                <Input id="description" defaultValue="Descrição"></Input>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="value" className="text-left">Valor</Label>
                <Input id="value" defaultValue="0.00"></Input>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="category" className="text-left">Categoria</Label>
                <Input id="category" defaultValue="Categoria"></Input>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="date" className="text-left">Data Prevista</Label>
                <Input id="date" defaultValue="dd/mm/aa"></Input>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline">Cancelar</Button>
            <Button type="submit">Adicionar Registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}