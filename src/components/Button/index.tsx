import React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "danger" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variantClasses = {
      default: "bg-[#2BBFA4] hover:bg-[#2d8373]",
      danger: "bg-[#F44336] hover:bg-[#FF1D0D]",
      outline:
        "bg-transparent border border-[#2BBFA4] text-[#2BBFA4] hover:bg-[#2BBFA4] hover:text-white",
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "z-10 px-4 py-2 rounded flex items-center gap-2 justify-center font-semibold transition disabled:bg-[#A3E7B8] disabled:cursor-not-allowed",
          variant === "outline" ? "" : "text-white",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
