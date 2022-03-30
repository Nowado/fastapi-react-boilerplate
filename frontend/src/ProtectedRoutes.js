import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const token = sessionStorage.getItem('token');
  return Boolean(token);
};

const ProtectedRoutes = (scenario) => {
    const isAuth = useAuth();
    const guest_case = scenario['type'] === "guest" && isAuth
    const private_case = scenario['type'] === "private" && !isAuth
    if (scenario['type'] === "guest") return !isAuth ? <Outlet /> : <Navigate to="/" />;
    else if (scenario['type'] === "private") return isAuth ? <Outlet /> : <Navigate to="/login" />;
    else return isAuth ? <Outlet /> : <Navigate to="/potato" />;
};

export default ProtectedRoutes;