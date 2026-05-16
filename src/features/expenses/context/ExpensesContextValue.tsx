import { createContext, useEffect, useMemo, useState } from "react";
import type { Expense } from "../types/expense.types";
import { mockExpenses } from "../data/mockExpenses";
import { useAuth } from "../../auth/AuthContext";

interface ExpensesContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  setSearch: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setDateRange: (start: string, end: string) => void;
  setSortBy: (value: "date" | "amount" | "category") => void;
  toggleSort: (field: "date" | "amount" | "category") => void;

  // optional but recommended for UI arrows
  sortBy: "date" | "amount" | "category";
  sortOrder: "asc" | "desc";
}

export const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!token) {
      setExpenses(mockExpenses);
      return;
    }

    let mounted = true;

    const fetchExpensesData = async () => {
      try {
        const response = await fetch('http://localhost:9090/pet/api/v1/expenses/get-all-expense', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok && mounted) {
          const data = await response.json();
          setExpenses(Array.isArray(data) ? data : mockExpenses);
        } else if (!response.ok) {
          console.error('Failed to fetch expenses. Status:', response.status);
          if (mounted) setExpenses(mockExpenses);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        if (mounted) setExpenses(mockExpenses);
      }
    };

    void fetchExpensesData();

    return () => {
      mounted = false;
    };
  }, [token]);

  const addExpense = async (expense: Omit<Expense, "id">) => {
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch('http://localhost:9090/pet/api/v1/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(expense),
    });

    if (!response.ok) {
      throw new Error('Failed to add expense');
    }

    const newExpense = await response.json();
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = async (updated: Expense) => {
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`http://localhost:9090/pet/api/v1/expenses/updateExpense/${updated.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    if (!response.ok) {
      throw new Error('Failed to update expense');
    }

    const updatedExpense = await response.json();
    setExpenses((prev) =>
      prev.map((e) => (e.id === updated.id ? updatedExpense : e))
    );
  };

  const deleteExpense = async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`http://localhost:9090/pet/api/v1/expenses/deleteExpense/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleSort = (field: "date" | "amount" | "category") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredExpenses = useMemo(() => {
    let data = [...expenses];

    data = data.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || e.category === categoryFilter;

      const matchesDate =
        (!startDate || e.date >= startDate) &&
        (!endDate || e.date <= endDate);

      return matchesSearch && matchesCategory && matchesDate;
    });

    data.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "amount") comparison = a.amount - b.amount;
      if (sortBy === "date") comparison = a.date.localeCompare(b.date);
      if (sortBy === "category") comparison = a.category.localeCompare(b.category);

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return data;
  }, [expenses, search, categoryFilter, sortBy, sortOrder, startDate, endDate]);

  const setDateRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        filteredExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        setSearch,
        setCategoryFilter,
        setDateRange,
        setSortBy,
        toggleSort,
        sortBy,
        sortOrder,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};
