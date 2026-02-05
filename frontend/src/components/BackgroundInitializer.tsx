"use client";

import { useEffect } from "react";
import { getBackground } from "@/lib/background";

export default function BackgroundInitializer() {
  useEffect(() => {
    const theme = getBackground();
    
    // Apply background based on theme
    if (theme === "gradient") {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.className = "gradient-bg";
    } else if (theme === "green-waves") {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.className = "green-waves-bg";
    } else if (theme === "blue-waves") {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundAttachment = "";
      document.body.className = "blue-waves-bg";
    } else if (theme === "tranquil-lake") {
      document.body.className = "";
      document.body.style.backgroundImage = `url(/backgrounds/${theme}.png)`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }, []);

  return null;
}
