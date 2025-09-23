import React from "react";

export function PropertyDetailsCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-white dark:bg-[#23232e] shadow-md rounded-xl p-4">
      <div className="flex items-center gap-4">
        {/* Property Info */}
        <div className="flex flex-col">
          <div
            id="propertyValue"
            className="text-gray-800 dark:text-gray-300 text-sm mt-1"
          >
            {title}
          </div>
          <div
            id="propertyDetails"
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
