"use client";
import React, { useState } from "react";

export interface Airplane {
  id: string;
  name: string;
}

interface AirplaneSelectorProps {
  airplanes: Airplane[];
  onSelect: (selectedId: string) => void;
}

export default function AirplaneSelector({ airplanes, onSelect }: AirplaneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative w-full md:w-auto text-center md:text-left">
      <button
        onClick={toggleDropdown}
        className="w-full md:w-auto inline-flex items-center justify-center rounded-md px-3 py-2 md:px-4 md:py-2 bg-gray-800 text-sm md:text-base text-white hover:bg-gray-700 focus:outline-none"
      >
        Select Airplane
      </button>
      {isOpen && (
        <div className="absolute right-0 left-0 md:left-auto mt-2 w-full md:w-44 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 z-30">
          <div className="py-1 text-gray-200 max-h-60 overflow-y-auto">
            {airplanes.map((plane) => (
              <button
                key={plane.id}
                onClick={() => {
                  onSelect(plane.id);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
              >
                {plane.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
