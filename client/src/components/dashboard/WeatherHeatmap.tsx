// app/dashboard/components/WeatherHeatmap.tsx
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';


/**
 * Displays a simple weather or turbulence heatmap.
 * Could be replaced with an actual chart library or an image overlay.
 */
export default function WeatherHeatmap() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <div className="bg-white shadow-md rounded-md max-w-4xl w-full p-6">
      {/* Container for the map and the list */}
      <div className="flex flex-col md:flex-row">
        {/* Left side: map image */}
        <div className="md:w-2/3">
          <img
            src="/map.png" 
            alt="Map showing Europe"
            className="w-full h-auto"
          />
        </div>

        {/* Right side: bullet points */}
        <div className="md:w-1/3 md:pl-6 mt-4 md:mt-0">
          <ul className="space-y-3">
            <li className="flex items-center text-red-600">
              <ExclamationCircleIcon className="w-6 h-6 mr-2" />
              <span>Bad weather expected around England</span>
            </li>
            <li className="flex items-center text-green-600">
              <CheckCircleIcon className="w-6 h-6 mr-2" />
              <span>Weather condition is good</span>
            </li>
            <li className="flex items-center text-green-600">
              <CheckCircleIcon className="w-6 h-6 mr-2" />
              <span>Weather condition is good</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
}
