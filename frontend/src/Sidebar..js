import { slide as Menu } from 'react-burger-menu'
import './Sidebar.css';
import { signOut, isAuthenticated } from './auth';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import LogoutIcon from '@mui/icons-material/Logout';

const theme = createTheme();

export default props => {
  const useAuth = isAuthenticated()
  if (useAuth) {
    return (
      <ThemeProvider theme={theme}>
        <Menu>
          <Button variant="contained" href="/">
            Home
          </Button>
          <Button variant="contained" href="/items">
            Items
          </Button>
          <Button variant="contained" onClick={() => signOut()}
            href="/">
            Sign Out
          </Button>
        </Menu>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Menu>
        <Button variant="contained" href="/">
        Home
      </Button>
      <Button variant="contained" href="/login">
        Login
      </Button>
      <Button variant="contained" href="/register" >
        Register
      </Button >
      <Button variant="contained" href="/privacy-policy">
        Privacy Policy
      </Button>
    </Menu >
    </ThemeProvider >
  );
};

