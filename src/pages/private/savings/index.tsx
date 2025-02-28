import * as React from "react";

import { ArrowUpDown } from "lucide-react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DialogExpense } from "@/components/dialogs/dialog-expense";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

import { useExpense } from "@/context/ExpenseContext";

export type Savings = {
  id?: string;
  title: string;
  registerType: "expense" | "income";
  description: string;
  value: number;
  category: string;
  date: string;
};

interface DialogDeleteConfirmationProps {
  onConfirm: () => void;
}

export function DialogDeleteConfirmation({
  onConfirm,
}: DialogDeleteConfirmationProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-red-500 text-white hover:bg-red-400">
          Excluir Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir as despesas selecionadas? Esta
            ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-400" onClick={onConfirm}>
              Excluir
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const columns: ColumnDef<Savings>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Descrição</div>,
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <div className="flex justify-end w-full">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-end"
          >
            Valor
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("value"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "",
    enableHiding: true,
    enableSorting: false,
    cell: () => null,
  },
];

export function SavingsPage() {
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<{
    [key: string]: boolean;
  }>({});
  const { expenses, deleteExpenses } = useExpense();

  const table = useReactTable({
    data: expenses,
    columns,
    getRowId: (row) => row.id!.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteSelectedRows = () => {
    const selectedIds = Object.keys(rowSelection);
    if (selectedIds.length > 0) {
      deleteExpenses(selectedIds);
      toast({
        variant: "sucess",
        description: "Despesas foram removidas com sucesso!",
        duration: 3000,
      });
    } else {
      toast({
        variant: "destructive",
        description: "Nenhuma despesa foi selecionada.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div>
          <h1 className="h1 max-w-[25ch] font-semibold">Lista de Despesas</h1>
          <p className="text-sm text-muted-foreground">
            Sua lista de despesas!
          </p>
        </div>
      </div>
      <div className="flex justify-between py-4">
        <Input
          placeholder="Filtrar tags..."
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="space-x-2">
          <DialogExpense buttonClassName="bg-green-700 text-white hover:bg-green-600" />
          <DialogDeleteConfirmation onConfirm={handleDeleteSelectedRows} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Seguinte
          </Button>
        </div>
      </div>
    </div>
  );
}
