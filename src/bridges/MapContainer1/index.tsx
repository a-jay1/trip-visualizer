
import React from 'react';
import { MapContainer } from '@/components/Map';
import { MapData } from '@/components/Map/types';

interface MapContainer1Props {
  mapData: MapData;
}

const MapContainer1: React.FC<MapContainer1Props> = ({ mapData }) => {
  return <MapContainer mapData={mapData} />;
};

export default MapContainer1;