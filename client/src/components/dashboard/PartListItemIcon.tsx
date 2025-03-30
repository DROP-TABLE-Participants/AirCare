import React from 'react';
import { ExclamationCircleIcon, InformationCircleIcon, CogIcon, Battery0Icon, WrenchScrewdriverIcon } from '@heroicons/react/16/solid';

interface PartListItemIconProps {
  partName: string;
}

const PartListItemIcon: React.FC<PartListItemIconProps> = ({ partName }) => {

  const partIconMap: { [key: string]: React.ReactNode } = {
    'Engine': <CogIcon className="h-5 w-5 text-[#0231EF]" />,  
    'Landing Gear': <WrenchScrewdriverIcon className="h-5 w-5 text-[#0231EF]" />,  
    'Electrical Systems': <Battery0Icon className="h-5 w-5 text-[#0231EF]" />,  
    'Flight Control Surfaces': <ExclamationCircleIcon className="h-5 w-5 text-[#0231EF]" />,  
    'Hydraulic Systems': <WrenchScrewdriverIcon className="h-5 w-5 text-[#0231EF]" />,  
    'Navigation & Communication Systems': <CogIcon className="h-5 w-5 text-[#0231EF]" />,  
  };

  return (
    <div className="icon-container flex px-1 py-1.5 justify-center items-center gap-1.5 rounded-[0.29625rem] border-[0.5px] border-[solid] bg-white [box-shadow:0px_4px_4px_0px_rgba(2,_49,_239,_0.07)]">
      {partIconMap[partName] || <InformationCircleIcon className="h-5 w-5 text-gray-600" />}  {}
    </div>
  );
};

export default PartListItemIcon;