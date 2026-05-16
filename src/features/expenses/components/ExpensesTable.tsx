import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";
import { useExpenses } from "../context/ExpensesContext";
import type { Expense } from "../types/expense.types";

const categoryColors: Record<string, string> = {
  Food: "#4caf50",
  Entertainment: "#9c27b0",
  Transport: "#ff9800",
  Utilities: "#2196f3",
};

const ExpensesTable = ({ onEdit }: { onEdit: (expense: Expense) => void }) => {
  const {
    filteredExpenses,
    deleteExpense,
    toggleSort,
    sortBy,
    sortOrder,
  } = useExpenses();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const paginated = filteredExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderSortIcon = (field: "date" | "amount" | "category") => {
    if (sortBy !== field) {
      return (
        <ArrowUpwardIcon
          fontSize="small"
          sx={{ opacity: 0.3 }}
        />
      );
    }

    return sortOrder === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteExpense(expenseToDelete.id);
      setDeleteConfirmOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete expense");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setExpenseToDelete(null);
    setDeleteError("");
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ cursor: "pointer" }}
              onClick={() => toggleSort("date")}
            >
              <Box display="flex" alignItems="center" gap={1}>
                Date
                {renderSortIcon("date")}
              </Box>
            </TableCell>

            <TableCell
              sx={{ cursor: "pointer" }}
              onClick={() => toggleSort("category")}
            >
              <Box display="flex" alignItems="center" gap={1}>
                Category
                {renderSortIcon("category")}
              </Box>
            </TableCell>

            <TableCell>Description</TableCell>

            <TableCell
              align="right"
              sx={{ cursor: "pointer" }}
              onClick={() => toggleSort("amount")}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={1}
              >
                Amount
                {renderSortIcon("amount")}
              </Box>
            </TableCell>

            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginated.map((expense) => (
            <TableRow key={expense.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>
                {new Date(expense.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor:
                        categoryColors[expense.category] || "#999",
                    }}
                  />
                  <Typography variant="body2">
                    {expense.category}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell
                sx={{
                  maxWidth: 200,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {expense.title}
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 600 }}>
                ${expense.amount.toFixed(2)}
              </TableCell>

              <TableCell align="right">
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(expense)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(expense)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredExpenses.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />

      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <Typography>
            Are you sure you want to delete "{expenseToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpensesTable;