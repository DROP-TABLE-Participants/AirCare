// app/dashboard/components/WeatherHeatmap.tsx
import React from 'react';

/**
 * Displays a simple weather or turbulence heatmap.
 * Could be replaced with an actual chart library or an image overlay.
 */
export default function WeatherHeatmap() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Weather Heatmap</h2>
      <div className="w-full h-32 bg-gradient-to-r from-green-300 via-yellow-300 to-red-400 flex items-center justify-center">
        <span className="text-white font-bold">JFK → LAX</span>
      </div>
    </div>
  );
}
