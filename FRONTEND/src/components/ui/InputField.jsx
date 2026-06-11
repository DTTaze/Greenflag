import React from "react";

import { Input } from "./input";
import { Label } from "./label";

const InputField = React.forwardRef(
  (
    {
      id,
      label,
      type = "text",
      value,
      onChange,
      error,
      suffix,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          <Input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            ref={ref}
            required
            placeholder=" "
            disabled={disabled}
            className={`peer h-12 w-full rounded-lg border-2 border-slate-300 bg-transparent px-4 pt-4 pb-1 text-sm text-slate-800 placeholder-transparent transition-colors focus:border-emerald-700 focus:ring-0 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500 focus:dark:border-green-500 focus:dark:ring-1 focus:dark:ring-green-500/20 ${
              error ? "border-red-500 focus:border-red-500" : ""
            } ${className}`}
            {...props}
          />

          {suffix && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-slate-400 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-green-400">
              {suffix}
            </div>
          )}

          <Label
            htmlFor={id}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 bg-white px-1 text-sm text-slate-400 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-700 peer-disabled:top-0 peer-disabled:text-xs peer-disabled:text-slate-400 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-700 dark:bg-zinc-900 dark:text-zinc-400 peer-focus:dark:text-green-500 peer-[:not(:placeholder-shown)]:dark:text-green-500"
          >
            {label}
          </Label>
        </div>

        {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
