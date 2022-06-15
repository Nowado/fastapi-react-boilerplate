import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ProtectedRoutes from './ProtectedRoutes';
import Sidebar from './Sidebar.';
import Home from "./Home";
import ResetPassword from "./ResetPassword";
import Items from "./Items";


function App() {
  return (
    <div className="App" id="outer-container">
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div id="page-wrap">
        <BrowserRouter >
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route element={<ProtectedRoutes type="private" />}> */}
            <Route element={<ProtectedRoutes />}>
              {/* <Route path="/logout" element={<Logout />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/test"/> // If you ever need to test empty path for redirect
              {/* <Route path="/items" element={<Items />} /> */}
            </Route>
            {/* <Route element={<ProtectedRoutes type="guest" />}> */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<Items />} />

              <Route path="/reset_password" element={<ResetPassword />} />
              <Route path="/test2"/> // If you ever need to test empty path for redirect
            {/* </Route> */}
          </Routes>
        </BrowserRouter >
      </div>
    </div>
  );
}

export default App;
