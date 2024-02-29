import React, { useEffect, useState } from "react";

import { WavyBackground } from "./wavy-background";

function LoadingScreen() {
  return (
    <div className="w-full h-full fixed top-0 left-0 backdrop-blur">
      <WavyBackground
        children={<LoadingText />}
        colors={["#3fcf8e80", "#ffffff80", "#3fcf8e80", "#ffffff80"]}
        speed="slow"
      />
    </div>
  );
}

export default LoadingScreen;

function LoadingText() {
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingText === "Loading...") {
        setLoadingText("Loading.  ".replace(/ /g, "\u00A0"));
      } else if (loadingText === "Loading.  ".replace(/ /g, "\u00A0")) {
        setLoadingText("Loading.. ".replace(/ /g, "\u00A0"));
      } else if (loadingText === "Loading.. ".replace(/ /g, "\u00A0")) {
        setLoadingText("Loading...");
      }
    }, 500);
    return () => clearInterval(interval);
  });
  return (
    <div className="font-mono font-bold text-[#ffffff50]">{loadingText}</div>
  );
}
