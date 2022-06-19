import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { isAuthenticated } from "./auth";

// const useAuth = () => {
//   const token = sessionStorage.getItem('token');
//   return Boolean(token);
// };

const ProtectedRoutes = (scenario) => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (scenario['type'] === "guest") return !isAuth ? <Outlet /> : <Navigate to="/" replace state={{ from: location }}/>;
  else if (scenario['type'] === "private") return isAuth ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
  else return isAuth ? <Outlet /> : <Navigate to="/potato" />;
};

export default ProtectedRoutes;