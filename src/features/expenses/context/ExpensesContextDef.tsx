import { createContext } from "react";
import type { Expense } from "../types/expense.types";

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
}

export const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);