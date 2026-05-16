import { useContext } from "react";
import { ExpensesContext } from "./ExpensesContextDef";

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within ExpensesProvider");
  }
  return context;
};