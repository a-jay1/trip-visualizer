
import MapContainer1 from "@/bridges/MapContainer1";
import MapContainer from "../../bridges/MapContainer";
import mapData from "../../data/map.json";

const MapPage = () => {
    return (
        // <MapContainer mapData={mapData} />
        <MapContainer1 mapData={mapData} />
    )
}

export default MapPage;