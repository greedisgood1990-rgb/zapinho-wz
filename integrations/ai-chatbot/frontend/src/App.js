import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster } from "react-hot-toast";
import { RouterProvider, useRouter } from "./components/Router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Templates from "./pages/Templates";
import About from "./pages/About";
import Trial from "./pages/Trial";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";

// Inner component to access the router state
function AppContent() {
  const { path } = useRouter();
  const isTrial = path === "/trial" || path.startsWith("/trial/") || path.startsWith("/template/");

  // Route resolver switcher
  const renderPage = () => {
    if (path === "/trial" || path.startsWith("/trial/") || path.startsWith("/template/")) {
      return <Trial />;
    }
    switch (path) {
      case "/":
        return <Home />;
      case "/features":
        return <Features />;
      case "/templates":
        return <Templates />;
      case "/about":
        return <About />;
      case "/docs":
        return <Docs />;
      case "/contact":
        return <Contact />;

      default:
        // Redirect to Landing Home Page for any unmatched path
        return <Home />;
    }
  };

  return (
    <div className={`App ${isTrial ? "app-trial" : ""}`}>
      <Navbar />
      <div className="page-content">
        {renderPage()}
      </div>
      {!isTrial && <Footer />}
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppContent />
    </RouterProvider>
  );
}

export default App;
