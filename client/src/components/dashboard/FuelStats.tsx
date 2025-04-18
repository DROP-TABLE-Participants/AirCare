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
import { RulForecastVM } from "@/api/models/rulData";

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
  rulForecastData?: RulForecastVM[];
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

export default function FuelStats({ airplane, rulForecastData }: FuelStatsProps) {

  const [activeTab, setActiveTab] = useState<"fuel" | "engine">("fuel");

  console.log("Airplane Stats: ", rulForecastData);

  if (!airplane && !rulForecastData?.length && rulForecastData?.length == 0) {
    return (
      <div className="p-6 w-full border-[0.854px] border-solid border-[#C3CBDC]">
        <div className="flex items-center justify-center h-40 w-full text-gray-500">
          No aircraft selected
        </div>
      </div>
    );
  }

  let engineHealthData = airplane?.engineHealth || defaultStats.engineHealth;
  let fuelEfficiencyData = airplane?.fuelEfficiency || defaultStats.fuelEfficiency;
  let currentEngineHealth: number | undefined;
  let currentFuelEfficiency: number | undefined;

  if (rulForecastData && rulForecastData.length > 0) {

    const closestToToday = rulForecastData.reduce((prev, curr) => {
      const prevDate = new Date(prev.date);
      const currDate = new Date(curr.date);

      return Math.abs(prevDate.getTime() - Date.now()) < Math.abs(currDate.getTime() - Date.now())
        ? prev
        : curr;
    }
    );

    currentEngineHealth = closestToToday.engineHealthPercentage;

    currentFuelEfficiency = Math.max(0, currentEngineHealth - 17);

    engineHealthData = rulForecastData.map((forecast) => ({
      name: formatDate(forecast.date),
      value: forecast.engineHealthPercentage
    })); 

    fuelEfficiencyData = rulForecastData.map((forecast) => ({
      name: formatDate(forecast.date),
      value: Math.max(0, forecast.engineHealthPercentage  - 17)
    })); 
  }

  const data = activeTab === "fuel" ? fuelEfficiencyData : engineHealthData;

  const bigValue = activeTab === "fuel" 
    ? (currentFuelEfficiency !== undefined ? currentFuelEfficiency : data[data.length - 1]?.value || 0)
    : (currentEngineHealth !== undefined ? currentEngineHealth : data[data.length - 1]?.value || 0);

  const subtitle = activeTab === "fuel" ? "Fuel Efficiency" : "Engine Health";

  return (
    <div className="p-6 w-full border-[0.854px] border-solid border-[#C3CBDC]">

      {}
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

      {}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mt-8">
        {}
        <div className="mb-4 sm:mb-0 sm:mr-8">
          <h2 className="text-5xl font-bold leading-tight">{bigValue}%</h2>
          <p className="text-lg text-gray-500">{subtitle}</p>
          {rulForecastData && activeTab === "engine" && (
            <p className="text-sm text-blue-600 mt-1">
              {rulForecastData[0]?.isOkayToFlight 
                ? "Safe to fly" 
                : "Maintenance required"}
            </p>
          )}
        </div>

        {}
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

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric', year: '2-digit' });
  } catch {
    return "Unknown";
  }
}