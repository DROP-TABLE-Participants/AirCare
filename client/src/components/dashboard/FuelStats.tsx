"use client"; 
// "use client" is required in Next.js 13+ (App Router) to use Recharts on the client side.

import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { FireIcon } from "@heroicons/react/24/solid";

/** Sample data: value sloping downward over time. */
const data = [
  { name: "Jan", value: 90 },
  { name: "Feb", value: 88 },
  { name: "Mar", value: 85 },
  { name: "Apr", value: 82 },
  { name: "May", value: 80 },
  { name: "Jun", value: 78 },
];

export default function FuelStats() {
  return (
    <div className="bg-white rounded-md shadow-md p-6 max-w-xl w-full">
      {/* Title */}
      <div className="flex items-center space-x-2 text-gray-700 mb-4">
        <FireIcon className="w-5 h-5 text-red-500" />
        <span className="font-semibold text-sm">Fuel &amp; Emissions</span>
      </div>

      {/* Main content: big number + chart */}
      <div className="flex flex-col sm:flex-column items-start sm:items-left">
        {/* Left side: big text */}
        <div className="mb-4 sm:mb-0">
          <h2 className="text-5xl font-bold leading-tight">85%</h2>
          <p className="text-lg text-gray-500">Engine Health</p>
        </div>

        {/* Right side: line chart (with area fill) */}
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={[70, 95]} />
              <Tooltip cursor={{ stroke: "#3B82F6", strokeWidth: 1 }} />
              {/* Filled area under the line */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                fill="url(#colorValue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
