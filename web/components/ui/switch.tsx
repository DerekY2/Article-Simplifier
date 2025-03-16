import * as React from "react";

import { cn } from "@/lib/utils";

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(
      checked !== undefined ? checked : defaultChecked || false
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleToggle = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (checked === undefined) {
          setIsChecked(e.target.checked);
        }
        onChange?.(e);
      },
      [checked, onChange]
    );

    return (
      <div className="inline-flex items-center">
        <div
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
            isChecked ? "bg-primary" : "bg-input",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <input
            type="checkbox"
            ref={ref}
            checked={isChecked}
            onChange={handleToggle}
            disabled={disabled}
            className="sr-only"
            aria-checked={isChecked}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              isChecked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </div>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };