import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { useExpense } from "@/context/ExpenseContext";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
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

interface DialogExpenseProps {
  buttonClassName?: string;
}

export function DialogExpense({ buttonClassName }: DialogExpenseProps) {
  const { toast } = useToast();
  const { addExpense } = useExpense();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("immediately");
  const [formData, setFormData] = useState({
    title: "",
    registerType: "",
    description: "",
    value: "",
    category: "",
    date: "",
  });

  const isFormValid =
    formData.title &&
    formData.registerType &&
    formData.description &&
    formData.value &&
    formData.category &&
    (selectedValue === "immediately" || formData.date);

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addExpense({
      id: uuidv4(),
      title: formData.title,
      registerType: formData.registerType as "expense" | "income",
      description: formData.description,
      value: parseFloat(formData.value),
      category: formData.category,
      date:
        selectedValue === "immediately"
          ? new Date().toISOString().split("T")[0]
          : formData.date,
    });

    toast({
      variant: "sucess",
      description: "Sua despesa foi salva com sucesso!",
      duration: 3000,
    });

    navigate("/savings");
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        registerType: "",
        description: "",
        value: "",
        category: "",
        date: "",
      });
      setSelectedValue("immediately");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={buttonClassName}>
          Novo Registro
        </Button>
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
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Titulo"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="register-type" className="text-left">
                  Tipo de Registro
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, registerType: value }))
                  }
                >
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
                <Input
                  id="description"
                  name="description"
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="value" className="text-left">
                  Valor
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  placeholder="0.00"
                  value={formData.value}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="category" className="text-left">
                  Categoria
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Categoria"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="date">Data Prevista</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  placeholder="dd/mm/aa"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={selectedValue === "immediately"}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <RadioGroup value={selectedValue} onValueChange={handleRadioChange}>
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
              <Button type="submit" disabled={!isFormValid}>
                Adicionar Registro
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}