import React from "react";
import { Link } from "./Router";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          &copy; {new Date().getFullYear()} WhatsAppFlows. Built for
          high-conversion visual conversational systems.
        </p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/about">About Us</Link>
          <Link to="/docs">Documentation</Link>
          <Link to="/contact">Get WhatsApp API</Link>
        </div>
      </div>
    </footer>
  );
}
