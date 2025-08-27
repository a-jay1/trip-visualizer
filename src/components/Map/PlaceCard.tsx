import React from 'react';
import { SelectedPlace } from './types';

interface PlaceCardProps {
  place: SelectedPlace;
  onClose: () => void;
  onSubPlaceSelect: (place: SelectedPlace) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClose, onSubPlaceSelect }) => {
  return (
    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-[1000] bg-white rounded-xl shadow-2xl overflow-hidden w-80 border border-gray-200">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={place.image} 
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{place.name}</h3>
          {place.day && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Day {place.day}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {place.description}
        </p>

        {/* Places List */}
        {place.places && place.places.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Places to Visit:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {place.places.map((subPlace, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSubPlaceSelect(subPlace as SelectedPlace)}
                >
                  <img 
                    src={subPlace.image} 
                    alt={subPlace.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{subPlace.name}</p>
                    <p className="text-xs text-gray-500 truncate">{subPlace.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Get Directions
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
