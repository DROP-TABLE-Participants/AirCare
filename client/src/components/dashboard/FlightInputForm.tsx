// components/PlaneModal.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface SensorsData {
  oilPressure: number;
  oilTemperature: number;
  cylinderHeadTemperature: number;
  engineVibration: number;
  fuelFlowRate: number;
  engineRPM: number;
  hydraulicPressure: number;
  cabinPressureDifferential: number;
  outsideAirTemperature: number;
}

export interface PlaneData {
  aircraftModel: string;
  origin: string;
  destination: string;
  flightCycles: number;
  flightHours: number;
  payloadWeight: number;
  departureTime: string;
  arrivalTime: string;
  sensorsData: SensorsData;
}

// Default values from your provided JSON
const defaultPlaneData: PlaneData = {
  aircraftModel: "string",
  origin: "stri",
  destination: "stri",
  flightCycles: 2147483647,
  flightHours: 2147483647,
  payloadWeight: 2147483647,
  departureTime: "2025-03-30T00:41:06.488Z",
  arrivalTime: "2025-03-30T00:41:06.488Z",
  sensorsData: {
    oilPressure: 500,
    oilTemperature: 150,
    cylinderHeadTemperature: 300,
    engineVibration: 100,
    fuelFlowRate: 10000,
    engineRPM: 30000,
    hydraulicPressure: 5000,
    cabinPressureDifferential: 50,
    outsideAirTemperature: 50,
  },
};

interface PlaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlaneData) => void;
}

export default function PlaneModal({ isOpen, onClose, onSubmit }: PlaneModalProps) {
  const [selectedPlane, setSelectedPlane] = useState<string>("");
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [planeData, setPlaneData] = useState<PlaneData>(defaultPlaneData);

  if (!isOpen) return null;

  // Handle changes for top-level select
  const handlePlaneSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlane(e.target.value);
    setPlaneData((prev) => ({ ...prev, aircraftModel: e.target.value }));
  };

  // Handle changes for advanced fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Check if the field is inside sensorsData (assumed to have a "sensor_" prefix)
    if (name.startsWith("sensor_")) {
      const sensorKey = name.replace("sensor_", "") as keyof SensorsData;
      setPlaneData((prev) => ({
        ...prev,
        sensorsData: {
          ...prev.sensorsData,
          [sensorKey]: Number(value),
        },
      }));
    } else if (["flightCycles", "flightHours", "payloadWeight"].includes(name)) {
      // Convert numeric fields
      setPlaneData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setPlaneData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(planeData);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button 
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Enter Plane Information</h2>
        {/* Select Plane */}
        <div className="mb-4">
          <label htmlFor="plane-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Plane:
          </label>
          <select
            id="plane-select"
            value={selectedPlane}
            onChange={handlePlaneSelect}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">--Select a plane--</option>
            <option value="Boeing 737">Boeing 737</option>
            <option value="Airbus A320">Airbus A320</option>
            <option value="Embraer E190">Embraer E190</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Advanced Toggle */}
        <div className="mb-4">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 underline"
            onClick={() => setAdvancedOpen((prev) => !prev)}
          >
            {advancedOpen ? "Hide Advanced" : "Show Advanced"}
          </button>
        </div>

        {advancedOpen && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Aircraft Model:</label>
                <input
                  type="text"
                  name="aircraftModel"
                  value={planeData.aircraftModel}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin:</label>
                <input
                  type="text"
                  name="origin"
                  value={planeData.origin}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination:</label>
                <input
                  type="text"
                  name="destination"
                  value={planeData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Flight Cycles:</label>
                  <input
                    type="number"
                    name="flightCycles"
                    value={planeData.flightCycles}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Flight Hours:</label>
                  <input
                    type="number"
                    name="flightHours"
                    value={planeData.flightHours}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payload Weight:</label>
                  <input
                    type="number"
                    name="payloadWeight"
                    value={planeData.payloadWeight}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departure Time:</label>
                  <input
                    type="datetime-local"
                    name="departureTime"
                    value={planeData.departureTime.slice(0, 16)}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Arrival Time:</label>
                  <input
                    type="datetime-local"
                    name="arrivalTime"
                    value={planeData.arrivalTime.slice(0, 16)}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 mt-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
              <fieldset className="border border-gray-300 p-4 rounded">
                <legend className="text-sm font-medium text-gray-700 px-2">Sensors Data</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Oil Pressure:</label>
                    <input
                      type="number"
                      name="sensor_oilPressure"
                      value={planeData.sensorsData.oilPressure}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Oil Temperature:</label>
                    <input
                      type="number"
                      name="sensor_oilTemperature"
                      value={planeData.sensorsData.oilTemperature}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cylinder Head Temp:</label>
                    <input
                      type="number"
                      name="sensor_cylinderHeadTemperature"
                      value={planeData.sensorsData.cylinderHeadTemperature}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Engine Vibration:</label>
                    <input
                      type="number"
                      name="sensor_engineVibration"
                      value={planeData.sensorsData.engineVibration}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fuel Flow Rate:</label>
                    <input
                      type="number"
                      name="sensor_fuelFlowRate"
                      value={planeData.sensorsData.fuelFlowRate}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Engine RPM:</label>
                    <input
                      type="number"
                      name="sensor_engineRPM"
                      value={planeData.sensorsData.engineRPM}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hydraulic Pressure:</label>
                    <input
                      type="number"
                      name="sensor_hydraulicPressure"
                      value={planeData.sensorsData.hydraulicPressure}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cabin Pressure Diff:</label>
                    <input
                      type="number"
                      name="sensor_cabinPressureDifferential"
                      value={planeData.sensorsData.cabinPressureDifferential}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Outside Air Temp:</label>
                    <input
                      type="number"
                      name="sensor_outsideAirTemperature"
                      value={planeData.sensorsData.outsideAirTemperature}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 mt-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit Plane Data
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
