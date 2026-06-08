import React from "react";

import { Input } from "./input";
import { Label } from "./label";

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  suffix,
  disabled,
  className = "",
}) => {
  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder=" "
          disabled={disabled}
          className={`peer h-12 w-full rounded-lg border-2 border-slate-300 bg-transparent px-4 pt-4 pb-1 text-sm text-slate-800 placeholder-transparent transition-colors focus:border-emerald-700 focus:ring-0 focus:outline-none ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
        />

        {suffix && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-slate-400 hover:text-emerald-600">
            {suffix}
          </div>
        )}

        <Label
          htmlFor={id}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 bg-white px-1 text-sm text-slate-400 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-700 peer-disabled:top-0 peer-disabled:text-xs peer-disabled:text-slate-400 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-700"
        >
          {label}
        </Label>
      </div>

      {error && <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
