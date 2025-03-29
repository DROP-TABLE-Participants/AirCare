import React from 'react';
import PartsRiskListItem from './PartsRiskListItem';  // Import the new item component

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
    <div className="p-4 w-full border-[0.854px] border-[solid] border-[#C3CBDC] overflow-hidden">
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        Parts Health Prediction
      </h2>

      <ul className="overflow-y-scroll h-full">
        {parts.map((item, idx) => (
          <PartsRiskListItem key={idx} name={item.name} status={item.status} />
        ))}
      </ul>
    </div>
  );
}
