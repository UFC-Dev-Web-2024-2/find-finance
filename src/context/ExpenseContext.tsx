import { createContext, useContext, useState } from "react";
import { Savings } from "@/pages/private/savings";

interface ExpenseContextType {
  expenses: Savings[];
  addExpense: (expense: Savings) => void;
  deleteExpenses: (ids: string[]) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Savings[]>([]);

  const addExpense = (expense: Savings) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const deleteExpenses = (ids: string[]) => {
    setExpenses((prevExpenses) => prevExpenses.filter(expense => !ids.includes(expense.id)));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within an ExpenseProvider");
  }
  return context;
}
