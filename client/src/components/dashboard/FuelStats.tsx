import React from 'react';

interface FuelStatsProps {
  fuelConsumption: number;   // e.g. 4500 gal
  carbonFootprint: number;   // e.g. 90 tons CO2
}

export default function FuelStats({
  fuelConsumption,
  carbonFootprint,
}: FuelStatsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Fuel & Emissions</h2>
      <p className="mb-1">
        <strong>Predicted Fuel Consumption:</strong> {fuelConsumption} gal
      </p>
      <p className="mb-1">
        <strong>Carbon Footprint:</strong> {carbonFootprint} tons CO₂
      </p>
    </div>
  );
}