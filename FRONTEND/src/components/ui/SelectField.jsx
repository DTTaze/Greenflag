import React from "react";

import { Label } from "./label";

const SelectField = React.forwardRef(
  (
    {
      id,
      label,
      value,
      onChange,
      error,
      options = [],
      required = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative w-full">
        <div className="relative">
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            ref={ref}
            required={required}
            className={`peer h-12 w-full rounded-lg border-2 border-slate-300 bg-transparent px-4 pt-4 pb-1 text-sm text-slate-800 focus:border-emerald-700 focus:ring-0 focus:outline-none transition-colors dark:text-zinc-100 dark:border-zinc-700 dark:focus:border-emerald-500 cursor-pointer ${
              error ? "border-red-500 focus:border-red-500 dark:border-red-500" : ""
            } ${className}`}
            {...props}
          >
            <option value="" disabled hidden className="dark:bg-zinc-900"></option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-zinc-900 dark:text-zinc-100 text-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
          <Label
            htmlFor={id}
            className="pointer-events-none absolute left-3.5 bg-white px-1 text-slate-400 transition-all duration-200 dark:bg-zinc-900 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-700 dark:peer-focus:text-emerald-500 peer-[:valid]:top-0 peer-[:valid]:text-xs peer-[:valid]:text-emerald-700 dark:peer-[:valid]:text-emerald-500 top-1/2 -translate-y-1/2 peer-focus:translate-y-0 peer-[:valid]:translate-y-0"
          >
            {label}
          </Label>
        </div>
        {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
