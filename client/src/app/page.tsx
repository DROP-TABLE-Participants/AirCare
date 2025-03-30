"use client";
import React, { useState } from "react";
import PlaneSchematic from "../components/dashboard/PlaneSchematic";
import WeatherHeatmap from "../components/dashboard/WeatherHeatmap";
import PartsRiskList from "../components/dashboard/PartsRiskList";
import FlightIndexGauge from "@/components/dashboard/FlightIndexGauge";
import FuelStats from "../components/dashboard/FuelStats";
import Report from "@/components/dashboard/Report";
import MapWidget from "@/components/dashboard/MapWidget";
import Plane from "@/components/dashboard/plane";
import AirplaneSelector, { Airplane } from "@/components/misc/AirplaneSelector";

// Import the airplane data from your data file
import { airplanes } from "@/data/airplanes";

export default function DashboardPage() {
  // Keep track of the selected airplane id
  const [selectedPlaneId, setSelectedPlaneId] = useState<string | null>(null);

  // Find the airplane object by id
  const selectedPlane = airplanes.find((plane) => plane.id === selectedPlaneId);

  // Example map coordinates
  const start: [number, number] = [-73.935242, 40.730610]; // New York (start)
  const end: [number, number] = [-0.127758, 51.507351];     // London (end)

  return (
    <div className="w-full h-screen flex flex-row bg-[linear-gradient(180deg,_#F4F5F7_0%,_#E6E8F8_100%)]">
      {/* Sidebar */}
      <div className="sidebar h-full w-20 border-r-[0.85px] border-[#C3CBDC] bg-none" />

      {/* Main View */}
      <div className="main-view h-full w-full flex flex-col bg-none">
        {/* Navbar */}
        <div className="navbar w-full p-5 flex flex-row bg-none border-b-[0.85px] border-[#C3CBDC]">
          <h1 className="text-black">Hello</h1>
        </div>

        {/* Top Section */}
        <div className="top-section max-h-[35%] w-full flex flex-row bg-none">
        <FuelStats
          airplane={
            selectedPlane
              ? { 
                  engineHealth: selectedPlane.engineHealth, 
                  fuelEfficiency: selectedPlane.fuelEfficiency 
                }
              : undefined
          }
        />
          <FlightIndexGauge flightIndex={selectedPlane?.flightIndex} />
          <PartsRiskList parts={selectedPlane?.parts}/>
        </div>

        {/* Bottom Section */}
        <div className="bottom-section h-full w-full p-5 flex flex-row gap-5 bg-none">
          {/* Airplane Placeholder */}
          <div className="plane-placeholder h-full flex-1 bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] border-[0.854px] border-solid border-[#C3CBDC] rounded-[1.0625rem] p-6">
            <div className="rounded col-span-2 min-h-[500px] flex items-center justify-center relative">
              {selectedPlane ? (
                <>
                  <div className="absolute top-6 left-6 font-bold text-xl text-zinc-700">
                    {selectedPlane.name}
                  </div>
                  {/* Render the Plane component, passing problematic part names dynamically */}
                  <Plane
                    problemParts={
                      selectedPlane.partsHealth
                        .filter((p) => p.faulty)
                        .map((p) => p.name)
                    }
                  />
                </>
              ) : (
                <AirplaneSelector
                  airplanes={airplanes.map(({ id, name }) => ({ id, name }))}
                  onSelect={setSelectedPlaneId}
                />
              )}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="map-placeholder bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] h-full w-[40%] border-[0.854px] border-solid border-[#C3CBDC] rounded-[1.0625rem] p-6">
            <h1 className="text-black">Map placeholder</h1>
            <MapWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
