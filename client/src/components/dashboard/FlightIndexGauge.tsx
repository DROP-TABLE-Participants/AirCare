"use client"; 
// "use client" required in Next.js 13+ for using Recharts on the client side

import React from "react";
import { PieChart, Pie, Label } from "recharts";

/**
 * We divide 100% into 4 segments of 25 each.
 * Each segment gets a distinct fill color to create the gradient effect.
 */
const gaugeData = [
  { name: "Arc 1", value: 25, fill: "#7DE2FC" },
  { name: "Arc 2", value: 25, fill: "#4FC3F7" },
  { name: "Arc 3", value: 25, fill: "#30A1F2" },
  { name: "Arc 4", value: 25, fill: "#1E4AFF" },
];

export default function FlightIndexGauge() {
  return (
    <div className="bg-white rounded-md shadow-md p-6 max-w-sm w-full">
      {/* Title */}
      <div className="text-gray-700 mb-2">
        <span className="font-semibold text-sm">Flight Index</span>
      </div>

      {/* Gauge Container */}
      <div className="flex items-center justify-center">
        {/* Adjust width/height so the half circle fits nicely */}
        <PieChart width={220} height={140}>
          <Pie
            data={gaugeData}
            dataKey="value"
            cx="50%"
            cy="100%"      // Position the circle so that only the top half is visible
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            stroke="none"
            cornerRadius={10}
            paddingAngle={4}
          >
            {/* Center label (the large "825") */}
            <Label
              value="825"
              position="center"
              fill="#000"
              style={{ fontSize: "28px", fontWeight: "bold" }}
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
}
