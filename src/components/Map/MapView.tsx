import React, { useEffect, useRef, useState } from 'react';
import { MapData, SelectedPlace } from './types';
import ClientOnly from './ClientOnly';

// Fix for default markers in React Leaflet
const fixLeafletIcons = (L: typeof import('leaflet')) => {
  delete ((L.Icon.Default.prototype as unknown) as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface MapViewProps {
  mapData: MapData;
  center: [number, number];
  zoom: number;
  onPlaceSelect: (place: SelectedPlace) => void;
}


const MapView: React.FC<MapViewProps> = ({ mapData, center, zoom, onPlaceSelect }) => {


  // All hooks must be called before any return
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [leaflet, setLeaflet] = useState<typeof import('leaflet') | null>(null);
  const [reactLeaflet, setReactLeaflet] = useState<typeof import('react-leaflet') | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const mapRef = useRef<import('leaflet').Map | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('leaflet'),
        import('react-leaflet')
      ]).then(([L, RL]) => {
        fixLeafletIcons(L);
        setLeaflet(L);
        setReactLeaflet(RL);
        setLeafletLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Fetch real route using OSRM (free routing service)
  useEffect(() => {
    if (!leafletLoaded || !leaflet) return; // Wait for leaflet to load
    
    const createSequentialRoute = () => {
      const forwardRoute: [number, number][] = [[mapData.source.lat, mapData.source.lng]];
      
      // Add all destinations and their places in order
      mapData.destinations.forEach(destination => {
        // Add the main destination first
        forwardRoute.push([destination.lat, destination.lng]);
        
        // Add all places within this destination
        destination.places.forEach(place => {
          forwardRoute.push([place.lat, place.lng]);
        });
      });
      
      return forwardRoute;
    };

    const fetchRoute = async () => {
      const forwardRoute = createSequentialRoute();
      
      if (forwardRoute.length < 2) return;

      try {
        // Use OSRM (Open Source Routing Machine) API for routing
        const coordinates = forwardRoute.map(([lat, lng]) => `${lng},${lat}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
        
        const response = await fetch(osrmUrl);
        const data = await response.json();
        
        if (data.routes && data.routes[0] && data.routes[0].geometry) {
          // OSRM returns coordinates as [lng, lat], we need [lat, lng]
          const routeCoordinates = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
          );
          setRoutePolyline(routeCoordinates);
        } else {
          // Fallback to straight line if no route found
          setRoutePolyline(forwardRoute);
        }
      } catch (error) {
        console.error('Routing error:', error);
        // Fallback to straight line if error
        setRoutePolyline(forwardRoute);
      }
    };
    fetchRoute();
  }, [leafletLoaded, leaflet, mapData]);

  if (!leafletLoaded || !leaflet || !reactLeaflet) {
    return null;
  }

  // All code below this point is safe to use leaflet/reactLeaflet
  const { MapContainer, TileLayer, Marker, Popup, Polyline } = reactLeaflet;
  const L = leaflet;

  // Custom icon creation function
  const createCustomIcon = (imageUrl: string, size: [number, number] = [40, 40]) => {
    return L.divIcon({
      html: `
        <div style="
          width: ${size[0]}px; 
          height: ${size[1]}px; 
          border-radius: 8px; 
          border: 2px solid white; 
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          overflow: hidden;
          background: white;
        ">
          <img src="${imageUrl}" style="
            width: 100%; 
            height: 100%; 
            object-fit: cover;
          " alt="marker" />
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1]]
    });
  };

  // Create numbered waypoint icon
  const createNumberedIcon = (number: number, color: string = '#3b82f6') => {
    return L.divIcon({
      html: `
        <div style="
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          background: ${color}; 
          border: 2px solid white; 
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        ">
          ${number}
        </div>
      `,
      className: 'numbered-waypoint-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  // Create sequential route coordinates for waypoint markers and return route
  const createSequentialRoute = () => {
    const forwardRoute: [number, number][] = [[mapData.source.lat, mapData.source.lng]];
    
    // Add all destinations and their places in order
    mapData.destinations.forEach(destination => {
      // Add the main destination first
      forwardRoute.push([destination.lat, destination.lng]);
      
      // Add all places within this destination
      destination.places.forEach(place => {
        forwardRoute.push([place.lat, place.lng]);
      });
    });
    
    // Create return route (from last place back to source)
    const lastPoint = forwardRoute[forwardRoute.length - 1];
    const returnRoute: [number, number][] = [
      lastPoint,
      [mapData.source.lat, mapData.source.lng]
    ];
    
    return { forwardRoute, returnRoute };
  };

  const { forwardRoute, returnRoute } = createSequentialRoute();

  return (
    <ClientOnly>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* Real Transport Route Line (Blue) */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            color="#1976d2" // Google Maps blue
            weight={5}
            opacity={0.95}
          />
        )}

        {/* Return Route Line (Orange) */}
        <Polyline
          positions={returnRoute}
          color="#f97316"
          weight={4}
          opacity={0.8}
          dashArray="5, 10"
        />

        {/* Waypoint Numbers for Route Sequence */}
        {forwardRoute.map((coord, index) => {
          if (index === 0) return null; // Skip source marker (already shown)
          return (
            <Marker
              key={`waypoint-${index}`}
              position={coord}
              icon={createNumberedIcon(index, '#3b82f6')}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">Stop {index}</h3>
                  <p className="text-sm text-gray-600">Route waypoint</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Source Marker (Starting Point) */}
        <Marker
          position={[mapData.source.lat, mapData.source.lng]}
          icon={createCustomIcon(mapData.source.image)}
          zIndexOffset={2000}
          eventHandlers={{
            click: () => onPlaceSelect(mapData.source as SelectedPlace),
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold">🏠 {mapData.source.name}</h3>
              <p className="text-sm text-gray-600">{mapData.source.description}</p>
              <p className="text-xs text-blue-600 font-medium">Starting Point</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Markers */}
        {mapData.destinations.map((destination, index) => (
          <React.Fragment key={index}>
            <Marker
              position={[destination.lat, destination.lng]}
              icon={createCustomIcon(destination.image, [50, 50])}
              zIndexOffset={1500}
              eventHandlers={{
                click: () => onPlaceSelect(destination as SelectedPlace),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">🎯 Day {destination.day}: {destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.description}</p>
                  <p className="text-xs text-green-600 font-medium">{destination.places.length} places to visit</p>
                </div>
              </Popup>
            </Marker>

            {/* Place Markers within each destination */}
            {destination.places.map((place, placeIndex) => (
              <Marker
                key={`${index}-${placeIndex}`}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(place.image, [35, 35])}
                zIndexOffset={1000}
                eventHandlers={{
                  click: () => onPlaceSelect(place as SelectedPlace),
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold">📍 {place.name}</h3>
                    <p className="text-sm text-gray-600">{place.description}</p>
                    <p className="text-xs text-purple-600 font-medium">Day {destination.day} - Stop {placeIndex + 1}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        ))}
      </MapContainer>
    </ClientOnly>
  );
};

export default MapView;
