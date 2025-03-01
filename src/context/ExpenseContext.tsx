import { createContext, useContext, useState, useEffect } from "react";
import { Savings } from "@/pages/private/savings";
import { useUserLogged } from "@/hooks/use-user-logged";

interface ExpenseContextType {
  expenses: Savings[];
  addExpense: (expense: Savings) => void;
  deleteExpenses: (ids: string[]) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Savings[]>([]);
  const { user } = useUserLogged();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses?userId=" + user.id);
  
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
  
    if (user.id) fetchExpenses();
  }, [user.id]);
  

  const addExpense = async (expense: Omit<Savings, "id">) => {  
    try {
      const response = await fetch("https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...expense,
          userId: user?.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao adicionar despesa no servidor: ${response.statusText}`);
      }
  
      const newExpense: Savings = await response.json();
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]); 
  
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
    }
  };

  const deleteExpenses = async (ids: string[]) => {
    try {
      for (const id of ids) {
        const response = await fetch(`https://67c08efcb9d02a9f224a3ee1.mockapi.io/api/v3/expenses/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          console.error(`Erro ao deletar a despesa com id ${id}:`, response.statusText);
          return;
        }
      }
  
      setExpenses((prevExpenses) => prevExpenses.filter((exp) => !ids.includes(exp.id!)));
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