import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { useIsAuthenticated } from 'react-auth-kit';

// const useAuth = () => {
//   const token = sessionStorage.getItem('token');
//   return Boolean(token);
// };

const ProtectedRoutes = (scenario) => {
  const isAuth = useIsAuthenticated()
  const location = useLocation();
  console.log(useIsAuthenticated())
  // return isAuth ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" replace state={{ from: location }} />
  // );
  const guest_case = scenario['type'] === "guest" && isAuth
  const private_case = scenario['type'] === "private" && !isAuth
  if (scenario['type'] === "guest") return !isAuth ? <Outlet /> : <Navigate to="/" />;
  else if (scenario['type'] === "private") return isAuth ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
  else return isAuth ? <Outlet /> : <Navigate to="/potato" />;
};

export default ProtectedRoutes;