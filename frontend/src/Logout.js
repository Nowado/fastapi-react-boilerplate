import { useNavigate } from "react-router-dom";

export default function Logout() {
    let navigate = useNavigate();
    sessionStorage.clear();
    navigate(-1);
    return 'logged out'
  }