"use client";
import React from "react";
import PartsRiskListItem from "./PartsRiskListItem";

interface Part {
  name: string;
  status: string;
}

interface PartsRiskListProps {
  parts?: Part[];
}

export default function PartsRiskList({ parts }: PartsRiskListProps) {
  // If no parts data is provided, display a fallback message.
  if (!parts) {
    return (
      <div className="p-4 w-full border-[0.854px] border-solid border-[#C3CBDC] flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Parts Health Prediction</h2>
        <p className="text-gray-500">No parts health data available</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full border-[0.854px] border-solid border-[#C3CBDC] overflow-hidden">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Parts Health Prediction</h2>
      <ul className="sm:overflow-y-scroll h-full">
        {parts.map((item, idx) => (
          <PartsRiskListItem key={idx} name={item.name} status={item.status} />
        ))}
      </ul>
    </div>
  );
}
