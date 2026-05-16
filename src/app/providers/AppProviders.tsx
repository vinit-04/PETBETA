import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../theme/theme";
import { ExpensesProvider } from "../../features/expenses/context/ExpensesContext";
import { AuthProvider } from "../../features/auth/AuthContext";
import AppRouter from "../router/AppRouter";

const AppProviders = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ExpensesProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ExpensesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;