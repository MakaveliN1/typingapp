import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import TypingApp from "./App";
import LoginForm from "./Components/LoginForm";
import RegistrationForm from "./Components/RegisterForm";
import DisplayStats from "./Components/DisplayStats";
import LeaderBoard from "./Components/LeaderBoard";
import Layout from "./Components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TypingApp />} />
          <Route path="Login" element={<LoginForm />} />
          <Route path="DisplayStats" element={<DisplayStats />} />
          <Route path="LeaderBoard" element={<LeaderBoard />} />
          <Route path="Register" element={<RegistrationForm />} />
          <Route path="*" element={<TypingApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
