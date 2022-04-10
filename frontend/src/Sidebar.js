import { slide as Menu } from 'react-burger-menu'
import './Sidebar.css';

export default props => {
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
