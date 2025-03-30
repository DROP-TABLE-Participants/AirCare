"use client";
import React from "react";
import { PieChart, Pie, Label } from "recharts";

interface FlightIndexGaugeProps {
  flightIndex?: number;
}

const FlightIndexGauge: React.FC<FlightIndexGaugeProps> = ({ flightIndex }) => {

  const gaugeData = [
    { name: "Arc 1", value: 25, fill: "#7DE2FC" },
    { name: "Arc 2", value: 25, fill: "#4FC3F7" },
    { name: "Arc 3", value: 25, fill: "#30A1F2" },
    { name: "Arc 4", value: 25, fill: "#1E4AFF" },
  ];

  const chartWidth = 300;
  const chartHeight = 300;
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const innerRadius = 130;

  const dotPositions = generateDotPositions(centerX, centerY, innerRadius - 15, 20);

  if (flightIndex === undefined) {
    return (
      <div className="p-6 w-full h-full border-[0.854px] border-solid border-[#C3CBDC] flex items-center justify-center">
        <span className="text-gray-500 font-medium">No flight index data available</span>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full border-[0.854px] border-solid border-[#C3CBDC]">
      {}
      <div className="text-gray-700 mb-2">
        <span className="font-semibold text-sm">Flight Safety Index</span>
      </div>

      {}
      <div className="flex items-center justify-center w-full h-full relative mt-16">
        <PieChart width={chartWidth} height={chartHeight}>
          <Pie
            data={gaugeData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius={innerRadius}
            outerRadius={145}
            stroke="none"
            cornerRadius={10}
            paddingAngle={4}
          >
            {}
            <Label
              value={flightIndex.toString()}
              position="center"
              fill="#000"
              style={{ fontSize: "42px", fontWeight: "bold" }}
            />
          </Pie>

          {}
          <svg>
            {dotPositions.map((dot, index) => (
              <circle
                key={index}
                cx={dot.x}
                cy={dot.y}
                r={1.3}
                fill="#7A7A7A"
                opacity={0.8}
              />
            ))}
          </svg>
        </PieChart>
      </div>
    </div>
  );
};

const generateDotPositions = (
  centerX: number,
  centerY: number,
  radius: number,
  count: number
) => {
  const dots = [];
  for (let i = 0; i <= count; i++) {
    const angle = (Math.PI * i) / count;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);
    dots.push({ x, y });
  }
  return dots;
};

export default FlightIndexGauge;