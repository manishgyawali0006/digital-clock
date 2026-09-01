import React, { useState, useEffect, useRef } from "react";

function DigitalClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="clock-wrap">
      <div className="clock-time">
        {hours}:{minutes}
        <span className="blink">:</span>
        {seconds}
      </div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
}

function Stopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    startTimeRef.current = Date.now();

    const intervalId = setInterval(() => {
      const runningFor = Date.now() - startTimeRef.current;
      setElapsedMs(accumulatedRef.current + runningFor);
    }, 10);

    return () => {
      clearInterval(intervalId);
      accumulatedRef.current += Date.now() - startTimeRef.current;
    };
  }, [isRunning]);

  const handleStartPause = () => setIsRunning((r) => !r);

  const handleReset = () => {
    setIsRunning(false);
    setElapsedMs(0);
    accumulatedRef.current = 0;
  };

  const formatTime = (ms) => {
    const totalCentis = Math.floor(ms / 10);
    const centis = totalCentis % 100;
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}.${pad(centis)}`;
  };

  return (
    <div className="stopwatch-wrap">
      <div className="stopwatch-time">{formatTime(elapsedMs)}</div>
      <div className="stopwatch-buttons">
        <button
          onClick={handleStartPause}
          className={isRunning ? "btn btn-pause" : "btn btn-start"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset} className="btn btn-reset">
          Reset
        </button>
      </div>
    </div>
  );
}

const DEFAULT_MINUTES = 25;

function PomodoroTimer() {
  const [minutesInput, setMinutesInput] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStartPause = () => {
    if (secondsLeft === 0) return;
    setIsRunning((r) => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(minutesInput * 60);
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setMinutesInput("");
      return;
    }
    const num = Math.max(1, Math.min(180, Number(value)));
    setMinutesInput(num);
  };

  const handleApplyMinutes = () => {
    const finalMinutes = minutesInput === "" ? DEFAULT_MINUTES : minutesInput;
    setMinutesInput(finalMinutes);
    setSecondsLeft(finalMinutes * 60);
    setIsRunning(false);
    setIsEditing(false);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const isFinished = secondsLeft === 0;

  return (
    <div className="pomodoro-wrap">
      {isEditing ? (
        <div className="pomodoro-edit">
          <label htmlFor="pomodoro-minutes">Set minutes</label>
          <input
            id="pomodoro-minutes"
            type="number"
            min="1"
            max="180"
            value={minutesInput}
            onChange={handleMinutesChange}
            className="pomodoro-input"
          />
          <button onClick={handleApplyMinutes} className="btn btn-start">
            Apply
          </button>
        </div>
      ) : (
        <>
          <div className={isFinished ? "pomodoro-time finished" : "pomodoro-time"}>
            {formatTime(secondsLeft)}
          </div>
          {isFinished && <div className="pomodoro-message">Time's up!</div>}
          <div className="pomodoro-buttons">
            <button
              onClick={handleStartPause}
              className={isRunning ? "btn btn-pause" : "btn btn-start"}
              disabled={isFinished}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleReset} className="btn btn-reset">
              Reset
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              Edit Time
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ClockStopwatchApp() {
  const [view, setView] = useState("clock");

  return (
    <div className="card">
      <div className="tabs">
        <button
          onClick={() => setView("clock")}
          className={view === "clock" ? "tab tab-clock active" : "tab"}
        >
          Clock
        </button>
        <button
          onClick={() => setView("stopwatch")}
          className={
            view === "stopwatch" ? "tab tab-stopwatch active" : "tab"
          }
        >
          Stopwatch
        </button>
        <button
          onClick={() => setView("pomodoro")}
          className={
            view === "pomodoro" ? "tab tab-pomodoro active" : "tab"
          }
        >
          Pomodoro
        </button>
      </div>

      {view === "clock" && <DigitalClock />}
      {view === "stopwatch" && <Stopwatch />}
      {view === "pomodoro" && <PomodoroTimer />}
    </div>
  );
}