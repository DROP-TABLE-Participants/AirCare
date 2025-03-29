// app/dashboard/page.tsx

import React from 'react';
import AircraftSelector from '../components/dashboard/AircraftSelector';
import FlightInputForm from '../components/dashboard/FlightInputForm';
import FuelStats from '../components/dashboard/FuelStats';
import PartsRiskList from '../components/dashboard/PartsRiskList';
import PlaneSchematic from '../components/dashboard/PlaneSchematic';
import WeatherHeatmap from '../components/dashboard/WeatherHeatmap';

export default function DashboardPage() {
  // Example data – in a real app, you might fetch this from an API
  const hoursFlown = 3500;
  const cycles = 1200;
  const fuelConsumption = 4500;
  const carbonFootprint = 90;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold mb-6">Aerospace Dashboard</h1>

      {/* ROW 1: Aircraft Info + Flight Input */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Aircraft Info</h2>
          <p className="mb-1">Hours Flown: {hoursFlown}</p>
          <p className="mb-3">Cycles: {cycles}</p>
          <AircraftSelector />
        </div>

        <div className="flex-1 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Flight Input</h2>
          <FlightInputForm />
        </div>
      </div>

      {/* ROW 2: Damage Prediction (Plane) + Weather Heatmap */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Damage Prediction Panel</h2>
          <PlaneSchematic />
        </div>

        <div className="flex-1 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Weather Heatmap</h2>
          <WeatherHeatmap />
        </div>
      </div>

      {/* ROW 3: Fuel Stats + Parts Risk List */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white rounded shadow p-4">
          <FuelStats
            fuelConsumption={fuelConsumption}
            carbonFootprint={carbonFootprint}
          />
        </div>

        <div className="flex-1 bg-white rounded shadow p-4">
          <PartsRiskList />
        </div>
      </div>
    </div>
  );
}
