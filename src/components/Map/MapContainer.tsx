import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapData, SelectedPlace } from './types';
import MapSidebar from './MapSidebar';
import PlaceCard from './PlaceCard';
import LoadingSpinner from './LoadingSpinner';


// Wrapper to ensure props are passed correctly to dynamic import
const DynamicMapView = dynamic(
  () => import('./MapViewWrapper'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

interface MapContainerProps {
  mapData: MapData;
}

const MapContainer: React.FC<MapContainerProps> = ({ mapData }) => {
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.5, 79.5]);
  const [mapZoom, setMapZoom] = useState(7);
    
  // Auto-focus on the first destination when component mounts
  useEffect(() => {
    if (mapData?.destinations?.length > 0) {
      const firstDestination = mapData.destinations[0];
      setMapCenter([firstDestination.lat, firstDestination.lng]);
      setMapZoom(10);
    }
  }, [mapData]);

  const handlePlaceSelect = (place: SelectedPlace) => {
    setSelectedPlace(place);
    setIsPopupVisible(true);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(12);
  };

  const handleDestinationClick = (destination: SelectedPlace) => {
    setSelectedPlace(destination);
    setIsPopupVisible(true);
    setMapCenter([destination.lat, destination.lng]);
    setMapZoom(11);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedPlace(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Import Leaflet CSS */}
      <style jsx global>{`
        @import url('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
        
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
        
        .numbered-waypoint-icon {
          background: transparent !important;
          border: none !important;
        }
        
        /* Custom styling for route polylines */
        .leaflet-interactive {
          cursor: pointer;
        }
        
        /* Enhanced popup styling */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        
        .leaflet-popup-content {
          margin: 8px 12px;
        }
      `}</style>

      {/* Map View */}
      <DynamicMapView
        mapData={mapData || {}}
        center={mapCenter}
        zoom={mapZoom}
        onPlaceSelect={handlePlaceSelect}
      />

      {/* Left Sidebar */}
      <MapSidebar
        mapData={mapData}
        onDestinationClick={handleDestinationClick}
      />

      {/* Route Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm font-bold mb-2 text-gray-800">Route Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-blue-500" style={{ borderTop: '2px dashed #3b82f6' }}></div>
            <span className="text-gray-600">Travel Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-0.5 bg-orange-500" style={{ borderTop: '2px dashed #f97316' }}></div>
            <span className="text-gray-600">Return Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-gray-600">Stop Numbers</span>
          </div>
        </div>
      </div>

      {/* Right Side Popup Card */}
      {isPopupVisible && selectedPlace && (
        <PlaceCard
          place={selectedPlace}
          onClose={closePopup}
          onSubPlaceSelect={handlePlaceSelect}
        />
      )}
    </div>
  );
};

export default MapContainer;
