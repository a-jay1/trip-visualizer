import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

const MapContainer = ({ mapData }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [scriptsLoaded, setScriptsLoaded] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            loadScripts();
        }
    }, []);

    useEffect(() => {
        if (scriptsLoaded && mapData && typeof window !== 'undefined' && window.L) {
            initializeMap();
        }
    }, [scriptsLoaded, mapData]);

    const loadScripts = () => {
        // Check if Leaflet is already loaded
        if (window.L) {
            setScriptsLoaded(true);
            return;
        }

        // Load Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Load Leaflet Routing CSS
        const routingCSS = document.createElement('link');
        routingCSS.rel = 'stylesheet';
        routingCSS.href = 'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css';
        document.head.appendChild(routingCSS);

        // Load Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
        leafletScript.onload = () => {
            // Load Leaflet Routing JS after Leaflet is loaded
            const routingScript = document.createElement('script');
            routingScript.src = 'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js';
            routingScript.onload = () => {
                setScriptsLoaded(true);
            };
            document.head.appendChild(routingScript);
        };
        document.head.appendChild(leafletScript);
    };

    const initializeMap = () => {
        // Initialize map
        const map = window.L.map('map').setView([12.5, 79.5], 7);
        mapInstanceRef.current = map;

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add source marker
        const sourceIcon = window.L.icon({
            iconUrl: mapData.source.image,
            iconSize: [40, 40],
            className: 'custom-message-icon'
        });

        window.L.marker([mapData.source.lat, mapData.source.lng], { icon: sourceIcon })
            .addTo(map)
            .bindPopup(`<b>${mapData.source.name}</b><br/>${mapData.source.description}`)
            .on('click', () => {
                setSelectedPlace(mapData.source);
                setIsPopupVisible(true);
            });

        // Add destination markers and routes
        let waypoints = [window.L.latLng(mapData.source.lat, mapData.source.lng)];
        
        mapData.destinations.forEach((destination, index) => {
            // Main destination marker
            const destIcon = window.L.icon({
                iconUrl: destination.image,
                iconSize: [40, 40],
                className: 'custom-message-icon'
            });

            window.L.marker([destination.lat, destination.lng], { icon: destIcon })
                .addTo(map)
                .bindPopup(`<b>Day ${destination.day}: ${destination.name}</b><br/>${destination.description}`)
                .on('click', () => {
                    setSelectedPlace(destination);
                    setIsPopupVisible(true);
                });

            waypoints.push(window.L.latLng(destination.lat, destination.lng));

            // Add place markers
            destination.places.forEach(place => {
                const placeIcon = window.L.icon({
                    iconUrl: place.image,
                    iconSize: [30, 30],
                    className: 'custom-place-icon'
                });

                window.L.marker([place.lat, place.lng], { icon: placeIcon })
                    .addTo(map)
                    .bindPopup(`<b>${place.name}</b><br/>${place.description}`)
                    .on('click', () => {
                        setSelectedPlace(place);
                        setIsPopupVisible(true);
                    });
            });
        });

        // Add routing
        if (window.L.Routing) {
            window.L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: false,
                createMarker: () => null, // Don't create default markers
                lineOptions: {
                    styles: [{ color: '#3b82f6', weight: 4, opacity: 0.7 }]
                }
            }).addTo(map);
        }
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        setSelectedPlace(null);
    };

    const handleDestinationClick = (destination) => {
        setSelectedPlace(destination);
        setIsPopupVisible(true);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([destination.lat, destination.lng], 12);
        }
    };

    return (
        <>
            <Head>
                <title>Trip Map</title>
            </Head>
            
            <div className="relative w-full h-screen bg-gray-100">
                {!scriptsLoaded && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading map...</p>
                        </div>
                    </div>
                )}
                
                {scriptsLoaded && (
                    <>
                        {/* Map Container */}
                        <div className="w-full h-full relative">
                            <div id="map" className="w-full h-full"></div>
                    
                    {/* Left Sidebar with Destinations */}
                    <div className="absolute left-4 top-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
                        <h3 className="text-lg font-bold mb-3 text-gray-800">Your Journey</h3>
                        <div className="space-y-3">
                            <div 
                                className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                                onClick={() => handleDestinationClick(mapData?.source)}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                    S
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{mapData?.source?.name}</p>
                                    <p className="text-xs text-gray-600">Starting Point</p>
                                </div>
                            </div>
                            
                            {mapData?.destinations?.map((destination, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                                    onClick={() => handleDestinationClick(destination)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                                        {destination.day}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{destination.name}</p>
                                        <p className="text-xs text-gray-600">{destination.places?.length} places</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Popup Card */}
                    {isPopupVisible && selectedPlace && (
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-[1000] bg-white rounded-xl shadow-2xl overflow-hidden w-80 border border-gray-200">
                            {/* Close Button */}
                            <button 
                                onClick={closePopup}
                                className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={selectedPlace.image} 
                                    alt={selectedPlace.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-800">{selectedPlace.name}</h3>
                                    {selectedPlace.day && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                            Day {selectedPlace.day}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {selectedPlace.description}
                                </p>

                                {/* Places List */}
                                {selectedPlace.places && selectedPlace.places.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Places to Visit:</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {selectedPlace.places.map((place, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                                    onClick={() => {
                                                        setSelectedPlace(place);
                                                        if (mapInstanceRef.current) {
                                                            mapInstanceRef.current.setView([place.lat, place.lng], 15);
                                                        }
                                                    }}
                                                >
                                                    <img 
                                                        src={place.image} 
                                                        alt={place.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{place.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{place.description}</p>
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
                    )}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .custom-message-icon {
                    border: 2px solid white !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 5px rgba(0,0,0,0.5) !important;
                    margin: 0px 0px 0px 25px !important;
                }
                
                .custom-place-icon {
                    border: 1px solid white !important;
                    border-radius: 6px !important;
                    box-shadow: 0 0 3px rgba(0,0,0,0.3) !important;
                    margin: 0px 0px 0px 15px !important;
                }

                .leaflet-routing-container {
                    display: none !important;
                }

                #map {
                    z-index: 0;
                }
            `}</style>
        </>
    );
};

export default MapContainer;