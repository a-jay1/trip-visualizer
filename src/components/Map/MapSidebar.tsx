import React from 'react';
import { MapData, SelectedPlace } from './types';

interface MapSidebarProps {
  mapData: MapData;
  onDestinationClick: (destination: SelectedPlace) => void;
}

const MapSidebar: React.FC<MapSidebarProps> = ({ mapData, onDestinationClick }) => {
  return (
    <div className="absolute left-4 top-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="text-lg font-bold mb-3 text-gray-800">Your Journey</h3>
      <div className="space-y-3">
        {/* Source */}
        <div 
          className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => onDestinationClick(mapData.source as SelectedPlace)}
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <div>
            <p className="font-medium text-gray-800">{mapData.source.name}</p>
            <p className="text-xs text-gray-600">Starting Point</p>
          </div>
        </div>
        
        {/* Destinations */}
        {mapData.destinations.map((destination, index) => (
          <div 
            key={index}
            className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
            onClick={() => onDestinationClick(destination as SelectedPlace)}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              {destination.day}
            </div>
            <div>
              <p className="font-medium text-gray-800">{destination.name}</p>
              <p className="text-xs text-gray-600">{destination.places.length} places</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapSidebar;
