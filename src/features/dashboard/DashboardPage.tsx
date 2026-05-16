import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useExpenses } from "../expenses/context/ExpensesContext";

const DashboardPage = () => {
  const { expenses } = useExpenses();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h4">${total}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;