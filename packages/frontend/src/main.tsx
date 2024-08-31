import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.scss";

const root = document.getElementById("root");
if (root == null) {
    throw new Error("Could not find #root");
}

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
