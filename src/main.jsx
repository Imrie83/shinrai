import React from "react";
import ReactDOM from "react-dom/client";
import { NavProvider }  from "./context/NavContext";
import { LangProvider } from "./context/LangContext";
import App from "./App";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </NavProvider>
  </React.StrictMode>
);
