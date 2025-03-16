import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Make sure the component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center p-2 rounded-full 
        transition-colors duration-200
        ${theme === "dark" 
          ? "bg-gray-1000 hover:bg-gray-600 text-white" 
          : "bg-gray-1000 hover:bg-gray-600 text-gray-800"}
      `}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle between dark and light mode</span>
    </button>
  );
}