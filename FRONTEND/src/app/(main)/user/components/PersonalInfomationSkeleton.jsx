import React from "react";

export default function PersonalInfomationSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-4xl mx-auto relative">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="bg-gray-200 h-6 w-40 rounded-md mb-4 mx-auto" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">
                <div className="bg-gray-200 h-5 w-24 rounded-md" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(3).fill(0).map((_, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <div className="bg-gray-200 h-5 w-32 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}