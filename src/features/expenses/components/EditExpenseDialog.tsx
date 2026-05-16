import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Expense } from "../types/expense.types";
import { useExpenses } from "../context/ExpensesContext";

interface Props {
  open: boolean;
  onClose: () => void;
  expense: Expense | null;
}

const EditExpenseDialog = ({ open, onClose, expense }: Props) => {
  const { updateExpense } = useExpenses();
  const [form, setForm] = useState<Expense | null>(expense);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(expense);
    setError("");
  }, [expense]);

  if (!form) return null;

  const handleChange = (field: keyof Expense, value: string) => {
    setForm({ ...form, [field]: field === "amount" ? Number(value) : value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.amount || !form.category) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateExpense(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Expense</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={loading}
            fullWidth
          />
          <TextField
            label="Amount"  
            type="number"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            disabled={loading}
            fullWidth
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            disabled={loading}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            disabled={loading}
            fullWidth
            multiline
            rows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditExpenseDialog;