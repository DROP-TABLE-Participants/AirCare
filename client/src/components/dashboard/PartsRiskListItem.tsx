import React, { useState } from 'react';
import PartListItemIcon from './PartListItemIcon';  

const statusColorMap: { [key: string]: string } = {
  Good: 'bg-green-100 text-green-800',
  'Likely To Fail': 'bg-yellow-100 text-yellow-800',
  'Check Mandatory': 'bg-red-100 text-red-800',
  'Possible Fault': 'bg-orange-100 text-orange-800',
};

interface PartsRiskListItemProps {
  name: string;
  status: string;
  reason?: string | null;
}

const PartsRiskListItem: React.FC<PartsRiskListItemProps> = ({ name, status, reason }) => {

  const [showReason, setShowReason] = useState(false);

  const colorClasses = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <li className="flex items-center justify-between px-[0rem] py-[0.6875rem] border-b-[0.85] border-[#C3CBDC] relative">
      <div className="flex items-center space-x-2">
        {}
        <PartListItemIcon partName={name} />
        <span className="text-gray-700 font-medium">{name}</span>

        {}
        {reason && (
          <button 
            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            onMouseEnter={() => setShowReason(true)}
            onMouseLeave={() => setShowReason(false)}
            onClick={() => setShowReason(!showReason)}
            aria-label="Show failure reason"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        {}
        {showReason && reason && (
          <div className="absolute left-0 bottom-full mb-2 p-2 bg-white shadow-lg rounded z-10 w-64 text-sm text-gray-700 border border-gray-200">
            {reason}
          </div>
        )}
      </div>
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${colorClasses}`}
      >
        {status}
      </span>
    </li>
  );
};

export default PartsRiskListItem;