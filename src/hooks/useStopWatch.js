// hooks/useStopWatch.ts

import { useState, useRef, useEffect } from "react";

const padStart = (num) => {
  return num.toString().padStart(2, "0");
};

const formatSec = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  minutes = minutes % 60;
  seconds = seconds % 60;

  let str = `${padStart(seconds)} secs`;

  if (minutes > 0) {
    str = `${padStart(minutes)} mins ${str}`;
  }

  if (hours > 0) {
    str = `${padStart(hours)} hrs ${str}`;
  }

  return str;
};

export const useStopWatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const interval = useRef();

  useEffect(() => {
    if (isRunning) {
      interval.current = setInterval(() => {
        setTime(time + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval.current);
      interval.current = undefined;
    };
  }, [isRunning, time]);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return {
    start,
    stop,
    reset,

    isRunning,
    time: formatSec(time),
  };
};
