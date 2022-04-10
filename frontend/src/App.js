import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import SignInSide from "./SignInSide";
import ProtectedRoutes from "./ProtectedRoutes";
import SignUp from "./SignUp"
import Logout from "./Logout"
import ResetPassword from "./ResetPassword"
import Sidebar from './Sidebar';

export default function App() {
  return (
    <div className="App" id="outer-container">
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div id="page-wrap">
        <BrowserRouter >
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route element={<ProtectedRoutes type="private" />}>
              <Route path="/logout" element={<Logout />} />
              <Route path="/" element={<Home />} />
              <Route path="/test"/> // If you ever need to test empty path for redirect
            </Route>
            <Route element={<ProtectedRoutes type="guest" />}>
              <Route path="/login" element={<SignInSide />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/reset_password" element={<ResetPassword />} />
              <Route path="/test2"/> // If you ever need to test empty path for redirect
            </Route>
          </Routes>
        </BrowserRouter >
      </div>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}