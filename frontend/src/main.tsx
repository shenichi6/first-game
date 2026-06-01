// @ts-ignore: avoid missing type declarations in this environment
import React from "react";
// @ts-ignore: avoid missing type declarations for react-dom
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-ignore: side-effect CSS import without types
import "./index.css";

// Use createElement to avoid JSX type-check issues when react types are absent
ReactDOM.createRoot(document.getElementById("root")!).render(
  React.createElement(App)
);