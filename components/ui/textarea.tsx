import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-amber-400 dark:border-orange-500 text-black dark:text-white bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-neutral-500 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-bold  dark:placeholder:text-white   dark:focus-visible:ring-neutral-300 dark:bg-pageColor",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
