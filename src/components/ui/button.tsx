import { cn } from "@/lib/cn";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const baseScales = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2 text-base",
            lg: "px-6 py-3 text-lg",
        };
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
            ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground",
            danger: "bg-red-600 text-white hover:bg-red-700",
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                    baseScales[size],
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
