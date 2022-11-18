import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ProtectedRoutes from './ProtectedRoutes';
import Sidebar from './Sidebar.';
import Home from "./Home";
import ResetPassword from "./ResetPassword";
import Items from "./Items";
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  return (
    <div className="App" id="outer-container">
      <div id="page-wrap">
        <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
        <BrowserRouter >
          <Routes>
            <Route element={<ProtectedRoutes type="private" />}>
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<Items />} />
              <Route path="/test" /> // If you ever need to test empty path for redirect
            </Route>
            <Route element={<ProtectedRoutes type="guest" />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/reset_password" element={<ResetPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/test2" /> // If you ever need to test empty path for redirect
            </Route>
          </Routes>
        </BrowserRouter >
      </div>
    </div>
  );
}

export default App;
