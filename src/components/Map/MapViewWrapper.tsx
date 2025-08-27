import React from 'react';
import MapView from './MapView';
import { MapData, SelectedPlace } from './types';

interface MapViewWrapperProps {
  mapData: MapData;
  center: [number, number];
  zoom: number;
  onPlaceSelect: (place: SelectedPlace) => void;
}

const MapViewWrapper: React.FC<MapViewWrapperProps> = (props) => {
  return <MapView {...props} />;
};

export default MapViewWrapper;
