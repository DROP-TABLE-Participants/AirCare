import React from 'react';
// Optionally install Heroicons for nice icons: npm install @heroicons/react
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/16/solid';

/**
 * We can map each status to specific Tailwind color classes.
 * Adjust as needed for your design/theme.
 */
const statusColorMap: { [key: string]: string } = {
  Good: 'bg-green-100 text-green-800',
  'Likely To Fail': 'bg-yellow-100 text-yellow-800',
  'Check Mandatory': 'bg-red-100 text-red-800',
  'Possible Fault': 'bg-orange-100 text-orange-800',
};

/**
 * (Optional) Map part names to different icons.
 * Otherwise, you can just use one icon for all.
 */
const partIconMap: { [key: string]: React.ReactNode } = {
  Engine: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
  'Electrical Systems': <CheckCircleIcon className="h-5 w-5 text-green-600" />,
  'Hydraulic Systems': <CheckCircleIcon className="h-5 w-5 text-green-600" />,
  'Flight Control Surfaces': <ExclamationCircleIcon className="h-5 w-5 text-red-600" />,
  'Navigation & Communication Systems': (
    <InformationCircleIcon className="h-5 w-5 text-orange-600" />
  ),
};

export default function PartsRiskList() {
  /**
   * Example data matching your screenshot.
   * Each item has a part name + status.
   */
  const parts = [
    { name: 'Engine', status: 'Good' },
    { name: 'Landing Gear', status: 'Likely To Fail' },
    { name: 'Electrical Systems', status: 'Good' },
    { name: 'Hydraulic Systems', status: 'Good' },
    { name: 'Flight Control Surfaces', status: 'Check Mandatory' },
    { name: 'Navigation & Communication Systems', status: 'Possible Fault' },
    { name: 'Electrical Systems', status: 'Good' },
    { name: 'Hydraulic Systems', status: 'Good' },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 max-w-sm w-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Parts Health Prediction
      </h2>

      <ul className="space-y-3">
        {parts.map((item, idx) => {
          // Determine color classes for the status badge:
          const colorClasses = statusColorMap[item.status] || 'bg-gray-100 text-gray-800';

          // Get icon based on the part name, or fallback:
          const icon = partIconMap[item.name] || (
            <InformationCircleIcon className="h-5 w-5 text-gray-600" />
          );

          return (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {icon}
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${colorClasses}`}
              >
                {item.status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};


