import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DialogExpense() {
  const [selectedValue, setSelectedValue] = useState("immediately");

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  return (
    <>
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

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="title" className="text-left">
                    Título
                  </Label>
                  <Input id="title" required placeholder="Titulo"></Input>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="register-type" className="text-left">
                    Tipo de Registro
                  </Label>
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
                  <Label htmlFor="description" className="text-left">
                    Descrição
                  </Label>
                  <Input id="description" placeholder="Descrição"></Input>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="value" className="text-left">
                    Valor
                  </Label>
                  <Input id="value" type="number" placeholder="0.00"></Input>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="category" className="text-left">
                    Categoria
                  </Label>
                  <Input id="category" placeholder="Categoria"></Input>
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="date"
                    className={
                      selectedValue === "immediately"
                        ? "text-gray-500 cursor-not-allowed"
                        : ""
                    }
                  >
                    Data Prevista
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    placeholder="dd/mm/aa"
                    disabled={selectedValue === "immediately"}
                  ></Input>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <RadioGroup
                defaultValue="immediately"
                value={selectedValue}
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediately" id="r1" />
                    <Label htmlFor="r1">Imediata</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="future" id="r2" />
                    <Label htmlFor="r2">Futura</Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">Adicionar Registro</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <DialogExpense />
    </>
  );
}
