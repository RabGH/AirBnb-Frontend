import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface Property {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  title: string;
}

interface DashboardMapProps {
  properties: Property[];
}

const DashboardMap: React.FC<DashboardMapProps> = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return <div>Error: Invalid map data</div>;
  }

  // Calculate the bounds of the map based on all the properties
  const bounds = properties.reduce(
    (bounds, property) =>
      bounds.extend([property.location.lat, property.location.lng]),
    new L.LatLngBounds([])
  );

  return (
    <div>
      <MapContainer bounds={bounds} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker key={property._id} position={[property.location.lat, property.location.lng]}>
            <Popup>{property.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DashboardMap;
