import * as React from "react";
import { createContext, useContext, useEffect, useState, useRef } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "dark" | "light";
  isDark: boolean;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  systemTheme: "light",
  isDark: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    // Set initial value
    setSystemTheme(mediaQuery.matches ? "dark" : "light");
    
    // Update when system preference changes
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  
  const transitionDuration = 100;
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add transition class before changing theme
    root.classList.add("theme-transition");
    
    // Remove previous classes
    root.classList.remove("light", "dark");
    
    // Apply the appropriate theme class
    if (theme === "system") {
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Remove transition class after the transition is complete
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, transitionDuration);
    
    return () => clearTimeout(timeout);
  }, [theme, systemTheme, transitionDuration]);
  
  // Add the CSS rule for transitions
  useEffect(() => {
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(
        `.theme-transition * {
          transition: all ${transitionDuration}ms ease !important;
        }`
      )
    );
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [transitionDuration]);
  

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
  
  const value = {
    theme,
    setTheme,
    systemTheme,
    isDark,
  };
  
  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};