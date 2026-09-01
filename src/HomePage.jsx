import React from "react";
import ClockStopwatchApp from "./ClockStopwatchApp";

export default function HomePage() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="logo">TimeKeeper</div>
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#app">App</a>
        </nav>
      </header>

      <section id="home" className="hero">
        <h1>Digital Clock & Stopwatch</h1>
        <p>
          A simple React app built to practice useEffect, timers, and
          cleanup functions.
        </p>
        <div className="hero-buttons">
          <a href="#app" className="btn btn-primary">
            Try the App
          </a>
        </div>
      </section>

      <section id="app" className="app-section">
        <ClockStopwatchApp />
      </section>

      <footer className="site-footer">
        <p className="footer-title">TimeKeeper</p>
        <p>
          Designed and built by <span className="footer-name">Manish Gyawali</span>{" "}
          while learning React — practicing useEffect, timers, and cleanup
          functions.
        </p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Manish Gyawali. All rights reserved.
        </p>
      </footer>
    </div>
  );
}