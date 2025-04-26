import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthScreen from "./custom_components/auth.tsx";
createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/inbox" element={<App />} />
        <Route path="/email/:emailId" element={<App email={true} />} />
        <Route path="/sent" element={<App view={"sent"} />} />
        <Route path="/drafts" element={<App view={"drafts"} />} />
        <Route path="/spam" element={<App view={"spam"} />} />
        <Route path="/trash" element={<App view={"trash"} />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
