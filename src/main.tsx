import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./index.css";
import routes from "./routes";

import { PrimeReactProvider } from "primereact/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={routes} />
    </PrimeReactProvider>
  </React.StrictMode>
);
