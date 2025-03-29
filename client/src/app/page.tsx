// app/dashboard/page.tsx

import React from 'react';
import PlaneSchematic from '../components/dashboard/PlaneSchematic';
import WeatherHeatmap from '../components/dashboard/WeatherHeatmap';
import PartsRiskList from '../components/dashboard/PartsRiskList';
import FlightIndexGauge from '@/components/dashboard/FlightIndexGauge';
import FuelStats from '../components/dashboard/FuelStats';
import Report from '@/components/dashboard/Report';
import MapWidget from '@/components/dashboard/MapWidget';
import Plane from '@/components/dashboard/plane';

export default function DashboardPage() {

  const start: [number, number] = [-73.935242, 40.730610]; // Example: New York (start)
  const end: [number, number] = [-0.127758, 51.507351];

  return (
      <div className="w-full h-screen flex flex-row bg-[linear-gradient(180deg,_#F4F5F7_0%,_#E6E8F8_100%)]">
         {/* Dashboard container */}

         <div className="sidebar h-full w-20 border-r-[0.85] border-[#C3CBDC] bg-none">
          {/* Sidebar */}
         </div>

         <div className="main-view h-full w-full flex flex-col bg-none">
          {/* Main View */}

          <div className="navbar w-full p-5 flex flex-row bg-none border-b-[0.85] border-[#C3CBDC]">
            <h1 className='text-[black]'>Hello</h1>
          </div>


          <div className="top-section max-h-[35%] w-full flex flex-row bg-none">
            {/* Top section */}
            <FuelStats />
            <FlightIndexGauge />
            <PartsRiskList />
          </div>

          <div className="bottom-section h-full w-full  p-5 flex flex-row gap-5 bg-none">
            {/* Bottom section */}
            <div className="plane-placeholder h-full flex-1 border-[0.854px] border-[solid] border-[#C3CBDC] rounded-[1.0625rem] p-6">
              <div className="rounded shadow p-4 col-span-2 min-h-[500px] flex items-center justify-center relative">
                <div className="absolute top-6 left-6 font-bold text-xl text-zinc-700">Boeing 737 Boris Air</div>
                <Plane />
              </div>
            </div>

            <div className="map-placeholder h-full w-[40%] border-[0.854px] border-[solid] border-[#C3CBDC] rounded-[1.0625rem] p-6">
              <h1 className='text-[black]'>Map placehoder</h1>

              <MapWidget/>
            </div>
          </div>
         </div>
      </div>
  );
}
