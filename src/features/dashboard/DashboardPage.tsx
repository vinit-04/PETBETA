import { Card, CardContent, Typography, Box } from "@mui/material";
import { useExpenses } from "../expenses/context/ExpensesContext";
import { useAuth } from "../auth/useAuth";

const DashboardPage = () => {
  const { expenses } = useExpenses();
  const { email } = useAuth();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Typography variant="h5" gutterBottom>
        Welcome back{email ? `, ${email}` : ''}!
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Total Expenses</Typography>
          <Typography variant="h4">${total}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;