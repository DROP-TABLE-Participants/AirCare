// app/dashboard/page.tsx

import React from 'react';
import PlaneSchematic from '../components/dashboard/PlaneSchematic';
import WeatherHeatmap from '../components/dashboard/WeatherHeatmap';
import PartsRiskList from '../components/dashboard/PartsRiskList';
import FlightIndexGauge from '@/components/dashboard/FlightIndexGauge';
import FuelStats from '../components/dashboard/FuelStats';
import Report from '@/components/dashboard/Report';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold mb-1">BOEING 737 - United Airways</h1>
      <p className="text-gray-500 mb-6">Flight #UA123 · London → New York</p>

      {/* ROW 1: Plane Schematic & Weather Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded shadow p-4">
          <PlaneSchematic />
        </div>
        <div className="bg-white rounded shadow p-4">
          <WeatherHeatmap />
        </div>
      </div>

      {/* ROW 2: Parts Health, Flight Index, and Fuel/Report stacked */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Parts Health Prediction */}
        <div className="bg-white rounded shadow p-4">
          <PartsRiskList />
        </div>

        {/* Column 2: Flight Index Gauge */}
        <div className="bg-white rounded shadow p-4">
          <FlightIndexGauge />
        </div>

        {/* Column 3: Fuel Stats on top, Summary Report below */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded shadow p-4">
            <FuelStats />
          </div>
          <div className="bg-white rounded shadow p-4">
            <Report />
          </div>
        </div>
      </div>
    </div>
  );
}
