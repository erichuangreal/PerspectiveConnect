"use client";

import { useState, useEffect } from "react";
import { getBackground, setBackground, BackgroundTheme } from "@/lib/background";

export default function BackgroundSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<BackgroundTheme>("gradient");

  useEffect(() => {
    setCurrent(getBackground());
  }, []);

  function selectBackground(theme: BackgroundTheme) {
    setBackground(theme);
    setCurrent(theme);
    setIsOpen(false);
    
    // Apply background immediately
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
      // Use image background
      document.body.className = "";
      document.body.style.backgroundImage = `url(/backgrounds/${theme}.png)`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }
  }

  const themes = [
    { id: "gradient" as BackgroundTheme, name: "Blue Gradient", preview: "linear-gradient(135deg, #f0f9ff, #e0f2fe, #bfdbfe)" },
    { id: "green-waves" as BackgroundTheme, name: "Green Waves", preview: "linear-gradient(135deg, #047857, #10b981, #6ee7b7)" },
    { id: "blue-waves" as BackgroundTheme, name: "Blue Waves", preview: "linear-gradient(135deg, #60a5fa, #a78bfa, #e9d5ff)" },
    { id: "tranquil-lake" as BackgroundTheme, name: "Tranquil Lake", preview: "linear-gradient(135deg, #5f9ea0, #7fb8bb, #a0d3d5)" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white/70 transition"
        title="Change background"
      >
        🎨
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-20 w-56 rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
            <div className="p-3">
              <div className="text-xs font-semibold text-slate-900 mb-2 px-2">
                Choose Background
              </div>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectBackground(theme.id)}
                  className={`w-full flex items-center gap-3 rounded-xl p-2 transition ${
                    current === theme.id
                      ? "bg-brand-50 border border-brand-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg border border-slate-200 shadow-sm"
                    style={{ background: theme.preview }}
                  />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-900">
                      {theme.name}
                    </div>
                    {current === theme.id && (
                      <div className="text-xs text-brand-600">✓ Active</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
