import { Typography, Paper, Button, Stack } from "@mui/material";
import { useState } from "react";
import type { Expense } from "./types/expense.types";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpensesTable from "./components/ExpensesTable";
import AddExpenseDialog from "./components/AddExpenseDialog";
import EditExpenseDialog from "./components/EditExpenseDialog";

const ExpensesPage = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Expenses</Typography>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add Expense
        </Button>
      </Stack>

      <ExpenseFilters />

      <Paper sx={{ p: 2 }}>
        <ExpensesTable onEdit={handleEdit} />
      </Paper>

      <AddExpenseDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <EditExpenseDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
      />
    </>
  );
};

export default ExpensesPage;