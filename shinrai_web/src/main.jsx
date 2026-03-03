import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LangProvider } from "./context/LangContext";
import { NavProvider }  from "./context/NavContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </NavProvider>
  </React.StrictMode>
);
