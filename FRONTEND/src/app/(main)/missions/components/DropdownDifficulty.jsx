import { ChevronDown } from "lucide-react";
import React from "react";

export const DropdownDifficulty = ({ difficultyLists }) => {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex-1">
          <span className="inline-block rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
            {difficultyLists}
          </span>
        </div>
        <ChevronDown className="text-gray-500" size={16} />
      </div>
    </div>
  );
};
