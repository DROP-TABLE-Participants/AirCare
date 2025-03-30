"use client";
import React from "react";
import { PieChart, Pie, Label } from "recharts";

interface FlightIndexGaugeProps {
  flightIndex?: number;
}

const FlightIndexGauge: React.FC<FlightIndexGaugeProps> = ({ flightIndex }) => {
  // Fixed gauge data (4 segments, each 25%) – the gauge range is always 0-1000.
  const gaugeData = [
    { name: "Arc 1", value: 25, fill: "#7DE2FC" },
    { name: "Arc 2", value: 25, fill: "#4FC3F7" },
    { name: "Arc 3", value: 25, fill: "#30A1F2" },
    { name: "Arc 4", value: 25, fill: "#1E4AFF" },
  ];

  if (flightIndex === undefined) {
    return (
      <div className="p-6 w-full h-full border-[0.854px] border-solid border-[#C3CBDC] flex items-center justify-center">
        <span className="text-gray-500 font-medium">No flight index data available</span>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full border-[0.854px] border-solid border-[#C3CBDC]">
      {/* Title */}
      <div className="text-gray-700 mb-2">
        <span className="font-semibold text-sm">Flight Index</span>
      </div>

      {/* Gauge Container */}
      <div className="flex items-center justify-center w-full h-full relative">
        <PieChart width={300} height={300}>
          <Pie
            data={gaugeData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={90}
            stroke="none"
            cornerRadius={10}
            paddingAngle={4}
          >
            {/* Center label displays the flightIndex value */}
            <Label
              value={flightIndex.toString()}
              position="center"
              fill="#000"
              style={{ fontSize: "28px", fontWeight: "bold" }}
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default FlightIndexGauge;
