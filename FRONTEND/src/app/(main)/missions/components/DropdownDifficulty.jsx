import React from "react";
import { FiChevronDown } from "react-icons/fi";

export const DropdownDifficulty = ({ difficultyLists }) => {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full text-white bg-blue-500`}>
                        {difficultyLists}
                    </span>
                </div>
                <FiChevronDown className="text-gray-500" />
            </div>
        </div>
    )
}