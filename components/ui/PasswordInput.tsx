import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input type={showPassword ? "text" : "password"} className={cn("pr-10", className)} ref={ref} {...props} />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute z-10 end-0 top-1/2 -translate-y-1/2 size-8 hover:bg-white/10 rounded-full text-white hover:text-white "
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.disabled}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
