import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const basename = import.meta.env.DEV ? "/" : "/WeMovies/";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
);
