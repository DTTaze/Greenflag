import React from "react";

export default function PersonalInfomationSkeleton() {
  return (
    <div className="relative mx-auto max-w-4xl rounded-lg border bg-white p-4 shadow-md">
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shimmer-effect" />
      </div>

      <div className="mx-auto mb-4 h-6 w-40 rounded-md bg-gray-200" />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">
                <div className="h-5 w-24 rounded-md bg-gray-200" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <div className="h-5 w-32 rounded-md bg-gray-200" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
