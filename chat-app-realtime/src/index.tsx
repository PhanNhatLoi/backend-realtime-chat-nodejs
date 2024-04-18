import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DataProvider from "./redux/store";
import { MessagesProvider } from "./components/Context/MessagesContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <DataProvider>
      <MessagesProvider>
        <App />
      </MessagesProvider>
    </DataProvider>
  </React.StrictMode>
);
