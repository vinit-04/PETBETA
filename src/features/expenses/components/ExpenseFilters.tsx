import { TextField, MenuItem, Stack } from "@mui/material";
import { useExpenses } from "../context/ExpensesContext";

const categories = ["All", "Food", "Entertainment", "Transport", "Utilities"];

const ExpenseFilters = () => {
  const { setSearch, setCategoryFilter, setSortBy, setDateRange } = useExpenses();

  return (
    <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
      <TextField
        label="Search"
        size="small"
        onChange={(e) => setSearch(e.target.value)}
      />

      <TextField
        select
        label="Category"
        size="small"
        defaultValue="All"
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Sort By"
        size="small"
        defaultValue="date"
        onChange={(e) => setSortBy(e.target.value)}
      >
        <MenuItem value="date">Date</MenuItem>
        <MenuItem value="amount">Amount</MenuItem>
        <MenuItem value="title">Title</MenuItem>
      </TextField>

      <TextField
        type="date"
        size="small"
        onChange={(e) => setDateRange(e.target.value, "")}
      />

      <TextField
        type="date"
        size="small"
        onChange={(e) => setDateRange("", e.target.value)}
      />
    </Stack>
  );
};

export default ExpenseFilters;