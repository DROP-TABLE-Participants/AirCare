"use client";
import React, { useState, useEffect } from "react";
import PlaneSchematic from "../components/dashboard/PlaneSchematic";
import WeatherHeatmap from "../components/dashboard/WeatherHeatmap";
import PartsRiskList from "../components/dashboard/PartsRiskList";
import FlightIndexGauge from "@/components/dashboard/FlightIndexGauge";
import FuelStats from "../components/dashboard/FuelStats";
import Report from "@/components/dashboard/Report";
import MapWidget from "@/components/dashboard/MapWidget";
import Plane from "@/components/dashboard/plane";
import AirplaneSelector, { Airplane } from "@/components/misc/AirplaneSelector";
import FlightSelector from "@/components/misc/FlightSelector";
import SkeletonLoader from "@/components/dashboard/SkeletonLoader";

// Import data
import { airplanes } from "@/data/airplanes";
import { flights } from "@/data/flights";

export default function DashboardPage() {
  // Keep track of the selected airplane id
  const [selectedPlaneId, setSelectedPlaneId] = useState<string | null>(null);
  
  // Keep track of departure and arrival ids
  const [departureId, setDepartureId] = useState<string | null>(null);
  const [arrivalId, setArrivalId] = useState<string | null>(null);
  
  // State to track if the plane dropdown is open
  const [isPlaneDropdownOpen, setIsPlaneDropdownOpen] = useState(false);
  
  // State for loading analytics data
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  
  // State to control sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Reset flight selection when airplane changes
  useEffect(() => {
    setDepartureId(null);
    setArrivalId(null);
  }, [selectedPlaneId]);

  // Find the airplane object by id
  const selectedPlane = airplanes.find((plane) => plane.id === selectedPlaneId);
  
  // Find the departure and arrival objects
  const departureFlight = flights.find((flight) => flight.id === departureId);
  const arrivalFlight = flights.find((flight) => flight.id === arrivalId);

  // Track if a complete flight route is selected
  const isFlightSelected = !!(departureFlight && arrivalFlight);

  // Track if both airplane and flight are selected
  const isFullyConfigured = !!selectedPlane && isFlightSelected;

  // Simulate loading analytics data when all required fields are selected
  useEffect(() => {
    if (isFullyConfigured) {
      setIsAnalyticsLoading(true);
      
      // Simulate API call with 2 second delay
      const timer = setTimeout(() => {
        setIsAnalyticsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isFullyConfigured, selectedPlaneId, departureId, arrivalId]);

  // Handle flight selection
  const handleFlightSelection = (newDepartureId: string | null, newArrivalId: string | null) => {
    setDepartureId(newDepartureId);
    setArrivalId(newArrivalId);
  };

  // Toggle plane dropdown
  const togglePlaneDropdown = () => {
    setIsPlaneDropdownOpen(prev => !prev);
  };
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Allow resetting flight selection
  const resetFlightSelection = () => {
    setDepartureId(null);
    setArrivalId(null);
  };

  // Allow selecting a different plane
  const handleChangePlane = (planeId: string) => {
    setSelectedPlaneId(planeId);
    setIsPlaneDropdownOpen(false);
  };

  return (
    <div className="w-full sm:max-h-screen md:h-screen flex flex-col md:flex-row overflow-scroll bg-[linear-gradient(180deg,_#F4F5F7_0%,_#E6E8F8_100%)]">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 shadow-md"
        aria-label="Toggle sidebar"
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Sidebar - Hidden on mobile by default */}
      <div className={`sidebar fixed md:static h-full w-screen md:w-20 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 bg-white/90 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-r-[0.85px] border-[#C3CBDC]`}>
        <div className="flex md:hidden justify-end p-4">
          <button onClick={toggleSidebar} className="p-2" aria-label="Close sidebar">
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Dashboard Icon */}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </div>
        
        {/* Analytics Icon */}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        
        {/* Fleet Icon */}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>
        
        {/* Settings Icon */}
        <div className="flex justify-center items-center h-20 w-full cursor-pointer hover:bg-[rgba(255,_255,_255,_0.5)] transition-colors">
          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
      </div>

      {/* Main View */}
      <div className="main-view h-full w-full overflow-auto flex flex-col bg-none">
        {/* Navbar */}
        <div className="navbar w-full p-5 flex flex-row justify-center md:justify-start bg-none border-b-[0.85px] border-[#C3CBDC]">
          <img src="/logo.svg" alt="Logo" className="h-8 w-28 mr-2" />
        </div>

        {/* Top Section */}
        <div className="top-section max-h-none md:max-h-[35%] w-full flex flex-col md:flex-row bg-none overflow-x-auto">
          {isFullyConfigured ? (
            isAnalyticsLoading ? (
              <>
                <SkeletonLoader type="fuelStats" />
                <SkeletonLoader type="flightIndex" />
                <SkeletonLoader type="riskList" />
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
                />
                <FlightIndexGauge flightIndex={selectedPlane?.flightIndex} />
                <PartsRiskList parts={selectedPlane?.parts}/>
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

        {/* Bottom Section */}
        <div className="bottom-section flex-1 w-full p-3 md:p-5 flex flex-col md:flex-row gap-3 md:gap-5 bg-none overflow-auto">
          {/* Airplane Placeholder */}
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
                  {/* Render the Plane component, showing problem parts only when fully configured */}
                  <Plane
                    problemParts={
                      isFullyConfigured && !isAnalyticsLoading
                        ? selectedPlane.partsHealth
                            .filter((p) => p.faulty)
                            .map((p) => p.name)
                        : [] // Empty array means no red parts will be shown
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

          {/* Map Section */}
          <div className="map-placeholder bg-[rgba(255,_255,_255,_0.42)] backdrop-filter backdrop-blur-[11px] w-full md:h-full md:w-[40%] border-[0.854px] border-solid border-[#C3CBDC] rounded-[1.0625rem] p-3 md:p-6">
            <div className="flex flex-col h-full">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                <h1 className="text-black text-lg md:text-xl font-semibold">Flight Map</h1>
                
                {/* Show FlightSelector only if plane is selected AND no complete flight route yet */}
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
                    
                    {/* Flight details overlay */}
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
    </div>
  );
}

// Helper function to calculate distance between two points in kilometers
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}
