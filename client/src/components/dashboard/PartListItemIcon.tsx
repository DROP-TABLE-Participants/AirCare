import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, CogIcon, Battery0Icon, WrenchScrewdriverIcon } from '@heroicons/react/16/solid';

interface PartListItemIconProps {
  partName: string;
}

const PartListItemIcon: React.FC<PartListItemIconProps> = ({ partName }) => {
  /**
   * Map part names to specific icons.
   */
  const partIconMap: { [key: string]: React.ReactNode } = {
    'Engine': <CogIcon className="h-5 w-5 text-[#0231EF]" />,  // Cog or gear to represent engine
    'Landing Gear': <WrenchScrewdriverIcon className="h-5 w-5 text-[#0231EF]" />,  // Tool icon for landing gear
    'Electrical Systems': <Battery0Icon className="h-5 w-5 text-[#0231EF]" />,  // Battery icon for electrical systems
    'Flight Control Surfaces': <ExclamationCircleIcon className="h-5 w-5 text-[#0231EF]" />,  // Use exclamation for importance
    'Hydraulic Systems': <WrenchScrewdriverIcon className="h-5 w-5 text-[#0231EF]" />,  // Wrench for hydraulic systems
    'Navigation & Communication Systems': <CogIcon className="h-5 w-5 text-[#0231EF]" />,  // Phone or communication icon
  };

  // Return the icon based on the part name, or a default icon
  return (
    <div className="icon-container flex px-1 py-1.5 justify-center items-center gap-1.5 rounded-[0.29625rem] border-[0.5px] border-[solid] border-[#BBB9BF] bg-white [box-shadow:0px_4px_4px_0px_rgba(2,_49,_239,_0.07)]">
      {partIconMap[partName] || <InformationCircleIcon className="h-5 w-5 text-gray-600" />}  {/* Default icon */}
    </div>
  );
};

export default PartListItemIcon;
