import { SensorData } from "./sensorData";

export interface RulForecastIM {
    aircraftModel: string;               
    flightCycles: number;                
    flightHours: number;                 
    lastReplacementDateOfEngine: string; 
    sensorsData: SensorData;
  }

  export interface RulForecastVM {
    date: string;                
    engineHealthPercentage: number;
    isOkayToFlight: boolean;
  }