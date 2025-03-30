"use client";
import React from "react";
import PartsRiskListItem from "./PartsRiskListItem";
import { PartFailure } from "@/api/models/failureData";

interface Part {
  name: string;
  status: string;
}

interface PartsRiskListProps {
  parts?: Part[];
  partFailures?: PartFailure[];
  featureIndex?: number;
}

export default function PartsRiskList({ parts, partFailures }: PartsRiskListProps) {

  if (!parts && !partFailures?.length) {
    return (
      <div className="p-4 w-full border-[0.854px] border-solid border-[#C3CBDC] flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Parts Health Prediction</h2>
        <p className="text-gray-500">No parts health data available</p>
      </div>
    );
  }

  const mapFailureProbabilityToStatus = (probability: string): string => {
    const value = parseFloat(probability);
    if (value > 0.7) return "Check Mandatory";
    if (value > 0.4) return "Likely To Fail";
    if (value > 0.2) return "Possible Fault";
    return "Good";
  };

  const getProcessedParts = () => {
    if (partFailures?.length) {

      return partFailures.map(failure => ({
        name: failure.part || "Unknown Part",
        status: mapFailureProbabilityToStatus(failure.failureProbability || "0"),
        reason: failure.reason
      }));
    }

    return parts || [];
  };

  const processedParts = getProcessedParts();

  return (
    <div className="p-4 w-full border-[0.854px] border-solid border-[#C3CBDC] overflow-hidden">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Parts Health Prediction</h2>
      <ul className="sm:overflow-y-scroll max-h-[300px]">
        {processedParts.map((item, idx) => (
          <PartsRiskListItem 
            key={idx} 
            name={item.name} 
            status={item.status} 
            reason={('reason' in item) ? item.reason as string : undefined} 
          />
        ))}
      </ul>
    </div>
  );
}