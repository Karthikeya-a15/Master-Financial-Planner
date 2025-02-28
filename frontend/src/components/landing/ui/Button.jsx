import React from "react";

const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-500",
  destructive: "bg-red-600 text-white hover:bg-red-500",
  outline: "border border-gray-300 bg-white hover:bg-gray-100",
  secondary: "bg-gray-600 text-white hover:bg-gray-500",
  ghost: "hover:bg-gray-100",
  link: "text-blue-600 underline hover:no-underline",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded px-3",
  lg: "h-11 rounded px-8",
  icon: "h-10 w-10 flex items-center justify-center",
};

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
