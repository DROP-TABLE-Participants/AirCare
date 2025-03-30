"use client";
import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { FireIcon } from "@heroicons/react/24/solid";

interface DataPoint {
  name: string;
  value: number;
}

export interface AirplaneStats {
  engineHealth: DataPoint[];
  fuelEfficiency: DataPoint[];
}

interface FuelStatsProps {
  airplane?: AirplaneStats;
}

const defaultStats: AirplaneStats = {
  fuelEfficiency: [
    { name: "Jan", value: 90 },
    { name: "Feb", value: 88 },
    { name: "Mar", value: 85 },
    { name: "Apr", value: 82 },
    { name: "May", value: 80 },
    { name: "Jun", value: 78 },
  ],
  engineHealth: [
    { name: "Jan", value: 95 },
    { name: "Feb", value: 93 },
    { name: "Mar", value: 91 },
    { name: "Apr", value: 89 },
    { name: "May", value: 87 },
    { name: "Jun", value: 85 },
  ],
};

export default function FuelStats({ airplane }: FuelStatsProps) {
  // If no airplane stats provided, show a fallback message.
  if (!airplane) {
    return (
      <div className="p-6 w-full border-[0.854px] border-solid border-[#C3CBDC]">
        <div className="flex items-center space-x-2 text-gray-700 mb-4">
          <FireIcon className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-sm">Fuel Efficiency & Engine Health</span>
        </div>
        <div className="flex items-center justify-center h-40 w-full text-gray-500">
          No aircraft selected
        </div>
      </div>
    );
  }

  // Use the provided airplane stats if available.
  const stats = airplane;
  const [activeTab, setActiveTab] = useState<"fuel" | "engine">("fuel");
  const data = activeTab === "fuel" ? stats.fuelEfficiency : stats.engineHealth;
  const bigValue = data[data.length - 1]?.value || 0;
  const subtitle = activeTab === "fuel" ? "Fuel Efficiency" : "Engine Health";

  return (
    <div className="p-6 w-full border-[0.854px] border-solid border-[#C3CBDC]">
      {/* Title & Icon */}

      {/* Tabs */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setActiveTab("fuel")}
          className={`px-4 py-2 rounded-md border ${
            activeTab === "fuel" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Fuel Efficiency
        </button>
        <button
          onClick={() => setActiveTab("engine")}
          className={`px-4 py-2 rounded-md border ${
            activeTab === "engine" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Engine Health
        </button>
      </div>

      {/* Content: Big number + chart */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* Left side: Big number & subtitle */}
        <div className="mb-4 sm:mb-0 sm:mr-8">
          <h2 className="text-5xl font-bold leading-tight">{bigValue}%</h2>
          <p className="text-lg text-gray-500">{subtitle}</p>
        </div>

        {/* Right side: Chart */}
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
              <YAxis hide domain={[70, 100]} />
              <Tooltip cursor={{ stroke: "#3B82F6", strokeWidth: 1 }} />
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
