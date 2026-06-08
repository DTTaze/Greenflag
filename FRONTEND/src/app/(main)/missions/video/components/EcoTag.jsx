import React from "react";

export default function EcoTag({ ecoTag }) {
  if (!ecoTag) return null;

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded bg-emerald-800/80 px-2.5 py-1.25 text-[12px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
      >
        <path
          fillRule="evenodd"
          d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
          clipRule="evenodd"
        />
      </svg>
      <span>{ecoTag}</span>
    </div>
  );
}
