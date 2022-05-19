import { slide as Menu } from 'react-burger-menu'
import './Sidebar.css';

const useAuth = () => {
  const token = sessionStorage.getItem('token');
  return Boolean(token);
};

export default props => {
  const isAuth = useAuth();
  if (isAuth){
    return (
      <Menu>
        <a className="sidebar-item" href="/">
        Home
        </a>
        <a className="sidebar-item" href="/items">
        Items
        </a>
        <a className="sidebar-item" href="/logout">
        Logout
        </a>
      </Menu>
    );
  }
  return (
    <Menu>
      <a className="sidebar-item" href="/">
      Home
      </a>
      <a className="sidebar-item" href="/login">
      Login
      </a>
      <a className="sidebar-item" href="/register">
      Register
      </a>
      <a className="sidebar-item" href="/logout">
      Logout
      </a>
    </Menu>
  );
};

