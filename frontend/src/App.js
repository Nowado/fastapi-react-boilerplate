import React from "react";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import SignInSide from "./SignInSide";
import ProtectedRoutes from "./ProtectedRoutes";
import SignUp from "./SignUp"
import Logout from "./Logout"
import ResetPassword from "./ResetPassword"
import { element } from "prop-types";

export default function App() {
  return (
    <BrowserRouter >
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
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
      </div>
    </BrowserRouter >
  );
}

function Home() {
  return <h2>Home</h2>;
}