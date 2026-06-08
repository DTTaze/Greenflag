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
  className = "" 
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
          className={`peer w-full h-12 pt-4 pb-1 px-4 bg-transparent border-2 border-slate-300 focus:border-emerald-700 rounded-lg text-sm text-slate-800 transition-colors placeholder-transparent focus:outline-none focus:ring-0 ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-slate-400 hover:text-emerald-600">
            {suffix}
          </div>
        )}
        
        <Label
          htmlFor={id}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 bg-white px-1 pointer-events-none transition-all duration-200 
            peer-focus:top-0 peer-focus:text-xs peer-focus:text-emerald-700 
            peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-emerald-700
            peer-disabled:top-0 peer-disabled:text-xs peer-disabled:text-slate-400"
        >
          {label}
        </Label>
      </div>
      
      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
};

export default InputField;