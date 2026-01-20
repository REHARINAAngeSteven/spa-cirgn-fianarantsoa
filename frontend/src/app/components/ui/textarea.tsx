import * as React from "react";
import { cn } from "./utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base
        "flex min-h-16 w-full resize-none rounded-md border border-input bg-input-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",

        // Focus (Tailwind v3 safe)
        "outline-none focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2",

        // Invalid state
        "aria-invalid:border-destructive aria-invalid:focus:ring-destructive",

        // Dark mode
        "dark:bg-input/30",

        className
      )}
      {...props}
    />
  );
}

export { Textarea };
