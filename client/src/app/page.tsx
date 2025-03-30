"use client";
import React, { useState, useEffect } from "react";
import PartsRiskList from "../components/dashboard/PartsRiskList";
import FlightIndexGauge from "@/components/dashboard/FlightIndexGauge";
import FuelStats from "../components/dashboard/FuelStats";
import MapWidget from "@/components/dashboard/MapWidget";
import Plane from "@/components/dashboard/plane";
import AirplaneSelector from "@/components/misc/AirplaneSelector";
import FlightSelector from "@/components/misc/FlightSelector";
import SkeletonLoader from "@/components/dashboard/SkeletonLoader";
import SensorDataModal from "@/components/dashboard/SensorDataModal";
import { SensorData } from "@/api/models/sensorData";
import { FailurePredictionVM } from "@/api/models/failureData";
import { RulForecastVM } from "@/api/models/rulData";

import {sendFailurePrediction, sendRulForecast} from "@/api/services/planeService";

import { airplanes } from "@/data/airplanes";
import { flights } from "@/data/flights";
import Image from "next/image";

export default function DashboardPage() {

  const [selectedPlaneId, setSelectedPlaneId] = useState<string | null>(null);

  const [departureId, setDepartureId] = useState<string | null>(null);
  const [arrivalId, setArrivalId] = useState<string | null>(null);

  const [isPlaneDropdownOpen, setIsPlaneDropdownOpen] = useState(false);

  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSensorDataModalOpen, setIsSensorDataModalOpen] = useState(false);

  const [isDataLoadin, setIsDataLoading] = useState(true);

  const [sensorData, setSensorData] = useState<SensorData>({
    oilPressure: 375, 
    oilTemperature: 95, 
    cylinderHeadTemperature: 210, 
    engineVibration: 42, 
    fuelFlowRate: 4250, 
    engineRPM: 22500, 
    hydraulicPressure: 3200, 
    cabinPressureDifferential: 7.8, 
    outsideAirTemperature: -15 
  });

  useEffect(() => {
    setDepartureId(null);
    setArrivalId(null);
  }, [selectedPlaneId]);

  const selectedPlane = airplanes.find((plane) => plane.id === selectedPlaneId);

  const departureFlight = flights.find((flight) => flight.id === departureId);
  const arrivalFlight = flights.find((flight) => flight.id === arrivalId);

  const isFlightSelected = !!(departureFlight && arrivalFlight);

  const isFullyConfigured = !!selectedPlane && isFlightSelected;

  useEffect(() => {
    if (isFullyConfigured) {
      setIsAnalyticsLoading(true);

      setSensorData({
        oilPressure: Math.floor(350 + Math.random() * 50), 
        oilTemperature: Math.floor(90 + Math.random() * 25), 
        cylinderHeadTemperature: Math.floor(200 + Math.random() * 40), 
        engineVibration: Math.floor(35 + Math.random() * 25), 
        fuelFlowRate: Math.floor(4000 + Math.random() * 1000), 
        engineRPM: Math.floor(22000 + Math.random() * 3000), 
        hydraulicPressure: Math.floor(3000 + Math.random() * 800), 
        cabinPressureDifferential: Math.floor(7 + Math.random() * 2 * 10) / 10, 
        outsideAirTemperature: Math.floor(-20 + Math.random() * 30) 
      });

      setIsAnalyticsLoading(false);

      setIsSensorDataModalOpen(true);
    }
  }, [isFullyConfigured, selectedPlaneId, departureId, arrivalId]);

  const [faultyParts, setFaultyParts] = useState<string[]>([]);

  const [failurePrediction, setFailurePrediction] = useState<FailurePredictionVM | null>(null);

  const [rulForecast, setRulForecast] = useState<RulForecastVM[] | null>(null);

  const handleSensorDataSave = (updatedData: SensorData) => {

    setSensorData(updatedData);

    const newFaultyParts: string[] = [];

    if (updatedData.oilPressure < 250 || updatedData.oilPressure > 420) {
      newFaultyParts.push('leftWing');  
    }

    if (updatedData.cylinderHeadTemperature > 250 || 
        updatedData.engineVibration > 60 || 
        updatedData.oilTemperature > 120) {
      newFaultyParts.push('backLeftWing');  
    }

    if (updatedData.hydraulicPressure < 2500 || updatedData.hydraulicPressure > 4200) {
      newFaultyParts.push('rightWing');  
    }

    if (updatedData.fuelFlowRate < 3500 || updatedData.fuelFlowRate > 6000) {
      newFaultyParts.push('backRightWing');  
    }

    setFaultyParts(newFaultyParts);

    setIsSensorDataModalOpen(false)

    sendFailurePrediction({
      aircraftModel: selectedPlane!.name,
      origin: departureFlight!.id,
      destination: arrivalFlight!.id,
      flightCycles: 1,
      flightHours: 1,
      payloadWeight: 1,
      departureTime: new Date().toISOString(),
      arrivalTime: new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toISOString(),
      sensorsData: {
        oilPressure: updatedData.oilPressure,
        oilTemperature: updatedData.oilTemperature,
        cylinderHeadTemperature: updatedData.cylinderHeadTemperature,
        engineVibration: updatedData.engineVibration,
        fuelFlowRate: updatedData.fuelFlowRate,
        engineRPM: updatedData.engineRPM,
        hydraulicPressure: updatedData.hydraulicPressure,
        cabinPressureDifferential: updatedData.cabinPressureDifferential,
        outsideAirTemperature: updatedData.outsideAirTemperature
      }
    }).then(response => {

      setFailurePrediction(response);

      setIsDataLoading(false);

    }).catch(error => {
      console.error("Error fetching failure prediction:", error);
    });

    sendRulForecast({
      aircraftModel: selectedPlane!.name,
      flightCycles: 1,
      flightHours: 1,
      lastReplacementDateOfEngine: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(), 
      sensorsData: updatedData
    }).then(response => {

      setRulForecast(response);
      console.log("RUL Forecast received:", response);
    }).catch(error => {
      console.error("Error fetching RUL forecast:", error);
    });
  };

  const handleFlightSelection = (newDepartureId: string | null, newArrivalId: string | null) => {
    setDepartureId(newDepartureId);
    setArrivalId(newArrivalId);
  };

  const togglePlaneDropdown = () => {
    setIsPlaneDropdownOpen(prev => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const resetFlightSelection = () => {
    setDepartureId(null);
    setArrivalId(null);
  };

  const handleChangePlane = (planeId: string) => {
    setSelectedPlaneId(planeId);
    setIsPlaneDropdownOpen(false);
  };

  const handleExport = () => {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); 
    const currentYear = currentDate.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthName = monthNames[currentMonth];

    let csvContent = "Aircraft,Current Engine Health (%),Months Until Maintenance Required,Maintenance Date,Notes\n";

    airplanes.forEach(airplane => {

      let currentEngineHealth = 0;
      const lastHealthEntry = airplane.engineHealth[airplane.engineHealth.length - 1] as { name: string; value: number };

      const engineHealthForCurrentMonth = (airplane.engineHealth as { name: string; value: number }[]).find((entry) => entry.name === currentMonthName);
      currentEngineHealth = engineHealthForCurrentMonth ? engineHealthForCurrentMonth.value : lastHealthEntry.value;

      let monthsUntilMaintenance = 0;
      let projectedHealth = currentEngineHealth;

      while (projectedHealth > 40) {
        projectedHealth -= 4; 
        monthsUntilMaintenance++;
      }

      const maintenanceDate = new Date(currentYear, currentMonth + monthsUntilMaintenance, 1);
      const formattedDate = `${maintenanceDate.getDate().toString().padStart(2, '0')}-${(maintenanceDate.getMonth() + 1).toString().padStart(2, '0')}-${maintenanceDate.getFullYear()}`;

      let notes = "";
      if (monthsUntilMaintenance <= 2) {
        notes = "URGENT - Schedule maintenance immediately";
      } else if (monthsUntilMaintenance <= 5) {
        notes = "Plan maintenance soon";
      } else {
        notes = "Routine maintenance schedule";
      }

      csvContent += [
        airplane.name,
        currentEngineHealth.toFixed(1),
        monthsUntilMaintenance,
        formattedDate,
        notes
      ].map(value => {

        const stringValue = String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',');
      csvContent += '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aircraft-maintenance-forecast-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full sm:max-h-screen md:h-screen flex flex-col md:flex-row overflow-scroll bg-[linear-gradient(180deg,_#F4F5F7_0%,_#E6E8F8_100%)]">
      {}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 shadow-md"
        aria-label="Toggle sidebar"
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {}
      <div className={`sidebar fixed md:static h-full w-screen md:w-20 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 bg-white/90 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-r-[0.85px] border-[#C3CBDC]`}>
        <div className="flex md:hidden justify-end p-4">
          <button onClick={toggleSidebar} className="p-2" aria-label="Close sidebar">
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </div>

        {}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>

        {}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>

        {}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      {}
      <div className="main-view h-full w-full overflow-auto flex flex-col bg-none">
        {}
        <div className="navbar w-full p-5 flex flex-row justify-between items-center bg-none border-b-[0.85px] border-[#C3CBDC]">
          {}
          <div className="flex items-center">
            <Image src="/logo.svg" alt="Logo" className="h-8 w-28 mr-2" width={0} height={0}/>
          </div>

          {}
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>

        {}
        <div className="top-section max-h-none md:max-h-[35%] w-full flex flex-col md:flex-row bg-none overflow-x-auto">
          {isFullyConfigured ? (
            isAnalyticsLoading || isDataLoadin ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : (
              <>
                <FuelStats
                  airplane={
                    selectedPlane
                      ? { 
                          engineHealth: selectedPlane.engineHealth, 
                          fuelEfficiency: selectedPlane.fuelEfficiency 
                        }
                      : undefined
                  }
                  rulForecastData={rulForecast || undefined}
                />
                <FlightIndexGauge flightIndex={failurePrediction?.featureIndex} />
                <PartsRiskList 
                  parts={selectedPlane?.parts}
                  partFailures={failurePrediction?.partFailures || []}
                  featureIndex={failurePrediction?.featureIndex}
                />
              </>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 md:p-6 h-full border-[0.854px] border-solid border-[#C3CBDC] bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] m-2 md:m-0 rounded-lg md:rounded-none">
              <div className="text-center">
                <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="mt-4 text-base md:text-lg font-medium text-gray-700">Analytics Pending</h3>
                <p className="mt-2 text-xs md:text-sm text-gray-500">
                  {!selectedPlane ? "Select an airplane first" : "Select both departure and arrival cities to see analytics"}
                </p>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="bottom-section flex-1 w-full p-3 md:p-5 flex flex-col md:flex-row gap-3 md:gap-5 bg-none overflow-auto">
          {}
          <div className="plane-placeholder w-full md:h-full md:flex-1 bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] border-[0.854px] border-solid border-[#C3CBDC] rounded-[1.0625rem] p-3 md:p-6">
            <div className="rounded col-span-2 min-h-[300px] md:min-h-[500px] flex items-center justify-center relative">
              {selectedPlane ? (
                <>
                  <div className="absolute top-2 md:top-6 left-2 md:left-6 flex justify-between items-center w-full pr-8 md:pr-12 z-10">
                    <span className="font-bold text-base md:text-xl text-zinc-700">
                      {selectedPlane.name}
                    </span>
                    <div className="relative">
                      <button
                        onClick={togglePlaneDropdown}
                        className="text-xs text-gray-600 hover:text-gray-900 underline"
                      >
                        Change plane
                      </button>

                      {isPlaneDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                          <div className="py-1 text-gray-200">
                            {airplanes.map((plane) => (
                              <button
                                key={plane.id}
                                onClick={() => handleChangePlane(plane.id)}
                                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${
                                  plane.id === selectedPlaneId ? 'bg-blue-800' : ''
                                }`}
                              >
                                {plane.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {}
                  <Plane
                    problemParts={
                      isFullyConfigured && !isAnalyticsLoading
                        ? faultyParts.length > 0 
                          ? faultyParts 
                          : selectedPlane.partsHealth
                              .filter((p: {faulty: string, name: string}) => p.faulty)
                              .map((p: {faulty: string, name: string}) => p.name)
                        : [] 
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

          {}
          <div className="map-placeholder bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] w-full md:h-full md:w-[40%] border-[0.854px] border-solid border-[#C3CBDC] rounded-[1.0625rem] p-3 md:p-6">
            <div className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                <h1 className="text-black text-lg md:text-xl font-semibold">Flight Map</h1>

                {}
                {selectedPlane && !isFlightSelected ? (
                  <FlightSelector
                    flights={flights}
                    onSelect={handleFlightSelection}
                  />
                ) : isFlightSelected ? (
                  <button 
                    onClick={resetFlightSelection}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Change flight
                  </button>
                ) : (
                  <div className="text-sm text-gray-500">Select an airplane first</div>
                )}
              </div>

              {isFlightSelected ? (
                <>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Flight Route:</span> {departureFlight!.name} to {arrivalFlight!.name}
                  </div>

                  <div className="flex-grow relative min-h-[250px]">
                    <MapWidget 
                      start={departureFlight!.coords} 
                      end={arrivalFlight!.coords}
                      startName={departureFlight!.name}
                      endName={arrivalFlight!.name}
                    />

                    {}
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-md">
                      <div className="text-xs md:text-sm font-medium">Flight Details</div>
                      <div className="text-xs">Distance: {Math.round(getDistanceInKm(
                        departureFlight!.coords[1], 
                        departureFlight!.coords[0], 
                        arrivalFlight!.coords[1], 
                        arrivalFlight!.coords[0]
                      ))} km</div>
                      <div className="text-xs">Est. Time: {Math.round(getDistanceInKm(
                        departureFlight!.coords[1], 
                        departureFlight!.coords[0], 
                        arrivalFlight!.coords[1], 
                        arrivalFlight!.coords[0]
                      ) / 850)} hours</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                  <div className="text-center p-4 md:p-8">
                    <svg className="mx-auto h-12 w-12 md:h-16 md:w-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 002 2v1a2 2 0 002 2h2.5M15 11h4.5a2 2 0 012 2v1a2 2 0 01-2 2h-4.5M6.5 17.7L4 19.5h16l-2.5-1.8M12 14v3"></path>
                    </svg>
                    <h3 className="mt-4 text-base md:text-lg font-medium">No Flight Selected</h3>
                    {selectedPlane ? (
                      <p className="mt-1 text-xs md:text-sm">Please select departure and arrival cities above to view the route.</p>
                    ) : (
                      <p className="mt-1 text-xs md:text-sm">Please select an airplane first, then you can select a flight route.</p>
                    )}

                    {(departureId && !arrivalId) && (
                      <div className="mt-4 text-xs md:text-sm p-2 bg-blue-100 text-blue-800 rounded-md">
                        Departure selected: <strong>{departureFlight?.name}</strong><br/>
                        Now select your destination.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <SensorDataModal
        isOpen={isSensorDataModalOpen}
        onClose={() => setIsSensorDataModalOpen(false)}
        sensorData={sensorData}
        aircraftName={selectedPlane?.name || ""}
        onSave={handleSensorDataSave}
      />
    </div>
  );
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}