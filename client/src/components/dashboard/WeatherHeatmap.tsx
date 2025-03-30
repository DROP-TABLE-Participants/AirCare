import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React from 'react';

export default function WeatherHeatmap() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <div className="bg-white shadow-md rounded-md max-w-4xl w-full p-6">
      {}
      <div className="flex flex-col md:flex-row">
        {}
        <div className="md:w-2/3">
          <Image
            width={0}
            height={0}
            src="/map.png" 
            alt="Map showing Europe"
            className="w-full h-auto"
          />
        </div>

        {}
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