'use client';
import React, { useState } from 'react';

export default function AircraftSelector() {
  const [selectedAircraft, setSelectedAircraft] = useState('N123AB');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAircraft(e.target.value);
  };

  return (
    <div>
      <label htmlFor="aircraft" className="block mb-1 font-medium">
        Select Aircraft:
      </label>
      <select
        id="aircraft"
        className="border p-2 rounded w-full"
        value={selectedAircraft}
        onChange={handleChange}
      >
        <option value="N123AB">N123AB</option>
        <option value="N456CD">N456CD</option>
        <option value="N789EF">N789EF</option>
      </select>
    </div>
  );
}