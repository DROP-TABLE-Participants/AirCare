import React from 'react';

export default function PlaneSchematic() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Damage Prediction Panel</h2>
      <div className="w-full flex justify-center">
        {}
        <div className="w-64 h-32 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">[Plane Image Placeholder]</span>
        </div>
      </div>
      <p className="text-red-500 mt-2">
        Left engine: High risk of failure in 50 cycles
      </p>
    </div>
  );
}