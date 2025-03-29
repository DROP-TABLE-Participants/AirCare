import React from 'react';

export default function PartsRiskList() {
  // Example data
  const parts = [
    { name: 'Landing Gear', cyclesLeft: 120 },
    { name: 'Left Engine', cyclesLeft: 50 },
    { name: 'Brake Pads', cyclesLeft: 35 },
    { name: 'Hydraulic Pump', cyclesLeft: 20 },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Parts Most Likely to Break</h2>
      <ul className="list-disc list-inside">
        {parts.map((part) => (
          <li key={part.name}>
            <strong>{part.name}</strong> – Approximately {part.cyclesLeft} cycles
          </li>
        ))}
      </ul>
    </div>
  );
}