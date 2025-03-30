/**
 * SensorData schema used by both failure prediction and RUL forecast.
 */
export interface SensorData {
    oilPressure: number;                // min: 0, max: 500
    oilTemperature: number;             // min: -40, max: 150
    cylinderHeadTemperature: number;    // min: -40, max: 300
    engineVibration: number;            // min: 0, max: 100
    fuelFlowRate: number;               // min: 0, max: 10000
    engineRPM: number;                  // min: 0, max: 30000
    hydraulicPressure: number;          // min: 0, max: 5000
    cabinPressureDifferential: number;  // min: 0, max: 50
    outsideAirTemperature: number;      // min: -50, max: 50
  }
  