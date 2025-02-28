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
        const response = await fetch("https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses");
  
        if (response.ok) {
          const expenses = await response.json();
          setExpenses(expenses as Savings[]);
        } else {
          console.error("Erro ao buscar despesas:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
      }
    };
  
    fetchExpenses();
  }, []);
  

  const addExpense = async (expense: Savings) => {
    const userId = "1";
    try {
      setExpenses((prevExpenses) => [...prevExpenses, expense]);

      const response = await fetch("https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: expense.title,
          registerType: expense.registerType,
          description: expense.description,
          value: expense.value,
          category: expense.category,
          date: expense.date,
          userId: userId
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
  
      for (let id of ids) {
        const response = await fetch(`https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          console.error(`Erro ao deletar a despesa com id ${id}:`, response.statusText);
        }
      }
  
      console.log("Despesas deletadas com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar as despesas:", error);
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