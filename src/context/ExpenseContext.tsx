import { createContext, useContext, useState, useEffect } from "react";
import { Savings } from "@/pages/private/savings";

interface ExpenseContextType {
  expenses: Savings[];
  addExpense: (expense: Savings) => void;
  deleteExpenses: (ids: string[]) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Savings[]>([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/1");
        if (response.ok) {
          const user = await response.json();
          setExpenses(user.expense as Savings[]);
        } else {
          console.error("Erro ao buscar usuário:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
      }
    };

    fetchExpenses();
  }, []);

  const addExpense = async (expense: Savings) => {
    try {
      setExpenses((prevExpenses) => [...prevExpenses, expense]);

      const response = await fetch("http://localhost:3000/users/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expense: [...expenses, expense],
        }),
      });

      if (!response.ok) {
        console.error("Erro ao adicionar despesa no servidor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  };

  const deleteExpenses = async (ids: string[]) => {
    try {
      const updatedExpenses = expenses.filter((exp) => !ids.includes(exp.id));

      setExpenses(updatedExpenses);

      const response = await fetch("http://localhost:3000/users/1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expense: updatedExpenses,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao deletar despesas no servidor:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao deletar despesas:", error);
    }
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