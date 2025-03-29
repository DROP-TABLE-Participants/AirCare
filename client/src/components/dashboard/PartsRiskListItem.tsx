import React from 'react';
import PartListItemIcon from './PartListItemIcon';  // Import the icon component

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

interface PartsRiskListItemProps {
  name: string;
  status: string;
}

const PartsRiskListItem: React.FC<PartsRiskListItemProps> = ({ name, status }) => {
  // Determine color classes for the status badge:
  const colorClasses = statusColorMap[status] || 'bg-gray-100 text-gray-800';

  return (
    <li className="flex items-center justify-between px-[0rem] py-[0.6875rem] border-b-[0.85] border-[#C3CBDC]">
      <div className="flex items-center space-x-2">
        {/* Display the icon for the part */}
        <PartListItemIcon partName={name} />
        <span className="text-gray-700 font-medium">{name}</span>
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
