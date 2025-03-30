import { SensorData } from "./sensorData";

/**
 * RUL Forecast Request Model
 */
export interface RulForecastIM {
    aircraftModel: string;               // minimum length: 1
    flightCycles: number;                // 1 to 2147483647
    flightHours: number;                 // 1 to 2147483647
    lastReplacementDateOfEngine: string; // ISO date-time
    sensorsData: SensorData;
  }
  
  /**
   * RUL Forecast Response Model
   */
  export interface RulForecastVM {
    date: string;                // ISO date-time
    engineHealthPercentage: number;
    isOkayToFlight: boolean;
  }