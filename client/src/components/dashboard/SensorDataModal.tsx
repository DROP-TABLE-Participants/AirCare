"use client";
import React, { useState, useEffect } from 'react';
import { SensorData } from '@/api/models/sensorData';

interface SensorDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensorData: SensorData;
  aircraftName: string;
  onSave: (updatedData: SensorData) => void;
}

// Define the min-max ranges for each sensor based on the C# model
const sensorRanges = {
  oilPressure: { min: 0, max: 500 },
  oilTemperature: { min: -40, max: 150 },
  cylinderHeadTemperature: { min: -40, max: 300 },
  engineVibration: { min: 0, max: 100 },
  fuelFlowRate: { min: 0, max: 10000 },
  engineRPM: { min: 0, max: 30000 },
  hydraulicPressure: { min: 0, max: 5000 },
  cabinPressureDifferential: { min: 0, max: 50 },
  outsideAirTemperature: { min: -50, max: 50 }
};

// Sample realistic sensor data with normalized values
const generateSampleSensorData = (): SensorData => ({
  oilPressure: 375, // psi (0-500 range)
  oilTemperature: 95, // °C (-40-150 range)
  cylinderHeadTemperature: 210, // °C (-40-300 range)
  engineVibration: 42, // units (0-100 range)
  fuelFlowRate: 4250, // kg/hour (0-10000 range)
  engineRPM: 22500, // RPM (0-30000 range)
  hydraulicPressure: 3200, // psi (0-5000 range)
  cabinPressureDifferential: 7.8, // psi (0-50 range)
  outsideAirTemperature: -15 // °C (-50-50 range)
});

const SensorDataModal: React.FC<SensorDataModalProps> = ({ 
  isOpen, 
  onClose, 
  sensorData: initialSensorData, 
  aircraftName,
  onSave
}) => {
  // Create local state for the editable sensor data
  const [editedData, setEditedData] = useState<SensorData>({ ...initialSensorData });
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (isOpen) {
      setEditedData({ ...initialSensorData });
    }
  }, [isOpen, initialSensorData]);

  if (!isOpen) return null;

  const formatValue = (value: number, unit: string): string => {
    return `${value.toLocaleString()} ${unit}`;
  };

  // Define units for each sensor
  const sensorUnits = {
    oilPressure: 'psi',
    oilTemperature: '°C',
    cylinderHeadTemperature: '°C',
    engineVibration: 'units',
    fuelFlowRate: 'kg/h',
    engineRPM: 'RPM',
    hydraulicPressure: 'psi',
    cabinPressureDifferential: 'psi',
    outsideAirTemperature: '°C'
  };

  // Define display names for each sensor
  const sensorDisplayNames = {
    oilPressure: 'Oil Pressure',
    oilTemperature: 'Oil Temperature',
    cylinderHeadTemperature: 'Cylinder Head Temperature',
    engineVibration: 'Engine Vibration',
    fuelFlowRate: 'Fuel Flow Rate',
    engineRPM: 'Engine RPM',
    hydraulicPressure: 'Hydraulic Pressure',
    cabinPressureDifferential: 'Cabin Pressure Differential',
    outsideAirTemperature: 'Outside Air Temperature'
  };

  // Function to handle input changes
  const handleInputChange = (key: keyof SensorData, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const range = sensorRanges[key];
    const clampedValue = Math.min(Math.max(numValue, range.min), range.max);
    
    setEditedData(prev => ({
      ...prev,
      [key]: clampedValue
    }));
  };

  // Calculate status based on data ranges
  const getStatusForSensor = (key: keyof SensorData): 'normal' | 'warning' | 'critical' => {
    const value = isEditing ? editedData[key] : initialSensorData[key];
    
    switch(key) {
      case 'oilPressure':
        return value > 420 || value < 250 ? 'warning' : 'normal';
      case 'oilTemperature':
        return value > 120 ? 'critical' : value > 100 ? 'warning' : 'normal';
      case 'cylinderHeadTemperature':
        return value > 250 ? 'warning' : 'normal';
      case 'engineVibration':
        return value > 60 ? 'warning' : 'normal';
      case 'engineRPM':
        return value > 25000 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  // Get color class based on status
  const getColorClass = (status: 'normal' | 'warning' | 'critical'): string => {
    switch(status) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'critical':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-green-100 border-green-400 text-green-800';
    }
  };

  // Save changes and close modal
  const handleSave = () => {
    onClose();
    onSave(editedData);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(prev => !prev);
    if (!isEditing) {
      // When entering edit mode, ensure we have the latest data
      setEditedData({ ...initialSensorData });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-hidden animate-fade-in-up max-h-[90vh] flex flex-col">
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
            {aircraftName} - Sensor Data
          </h2>
          <div className="flex items-center">
            <button
              onClick={toggleEditMode}
              className="text-white hover:text-gray-200 mr-4 flex items-center"
            >
              {isEditing ? (
                <>
                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Mode
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Edit Mode
                </>
              )}
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="mb-4 text-gray-700 font-medium">
            {isEditing 
              ? "Edit sensor values to simulate different conditions. Values will be validated against acceptable ranges."
              : "Live sensor readings for this aircraft. These values are used for predictive maintenance and risk analysis."}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(Object.keys(initialSensorData) as Array<keyof SensorData>).map((key) => {
              const status = getStatusForSensor(key);
              const colorClass = getColorClass(status);
              const currentValue = isEditing ? editedData[key] : initialSensorData[key];
              const range = sensorRanges[key];
              
              return (
                <div key={key} className="border rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
                    <span className="font-medium text-gray-700">{sensorDisplayNames[key]}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${colorClass}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor={`input-${key}`} className="text-sm text-gray-600 mr-2">
                            Value ({sensorUnits[key]}):
                          </label>
                          <span className="text-xs text-gray-500">
                            Range: {range.min} - {range.max} {sensorUnits[key]}
                          </span>
                        </div>
                        <input
                          id={`input-${key}`}
                          type="number"
                          value={currentValue}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          min={range.min}
                          max={range.max}
                          step={key === 'cabinPressureDifferential' ? 0.1 : 1}
                          className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <span className="text-gray-800 font-medium text-lg">
                            {formatValue(currentValue, sensorUnits[key])}
                          </span>
                        </div>
                        
                        {/* Progress bar visualization */}
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              status === 'normal' ? 'bg-blue-500' : 
                              status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, Math.max(0, currentValue/10))}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          {isEditing ? (
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Save & Continue
            </button>
          ) : (
            <button 
              onClick={() => onSave(initialSensorData)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorDataModal;