import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"hover:input-text-blur focus-visible:input-text-blur text-opacity-70 flex h-10 w-full rounded-md border bg-[var(--background-dark)] px-3 py-2 text-sm file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--border-light)] focus-visible:border-[var(--border-light)] hover:shadow-[0_0_25px_5px_rgba(30,41,59,1)_inset] focus-visible:shadow-[0_0_25px_5px_rgba(30,41,59,1)_inset] transition-all duration-300",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
