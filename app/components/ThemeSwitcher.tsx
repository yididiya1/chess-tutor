"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme, Theme } from "../contexts/ThemeContext";

const themes: { value: Theme; label: string; colors: string[] }[] = [
  {
    value: "light",
    label: "Light",
    colors: ["#ffffff", "#f3f4f6", "#1f2937"]
  },
  {
    value: "dark",
    label: "Dark",
    colors: ["#1f2937", "#374151", "#ffffff"]
  },
  {
    value: "blue",
    label: "Ocean Blue",
    colors: ["#1e40af", "#3b82f6", "#ffffff"]
  },
  {
    value: "purple",
    label: "Royal Purple",
    colors: ["#7c3aed", "#a855f7", "#ffffff"]
  },
  {
    value: "green",
    label: "Forest Green",
    colors: ["#059669", "#10b981", "#ffffff"]
  }
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        title="Change Theme"
      >
        <Palette size={18} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
            <div className="text-sm font-medium text-foreground mb-2 px-2">Choose Theme</div>
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {themeOption.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{themeOption.label}</span>
                </div>
                {theme === themeOption.value && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 