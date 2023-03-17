import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LatLngBounds, LatLngExpression } from 'react-leaflet';

interface Property {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  title: string;
}

interface DashBoardMapProps {
  properties: Property[];
}

const DashBoardMap: React.FC<DashBoardMapProps> = ({ properties }) => {
  const mapRef = useRef<MapContainer>(null);

  useEffect(() => {
    if (mapRef.current && properties.length > 0) {
      const bounds = new LatLngBounds();
      properties.forEach((property) => {
        bounds.extend(new LatLngExpression(property.location.lat, property.location.lng));

      });
      mapRef.current.fitBounds(bounds);
    }
  }, [properties]);

  const latitudes = properties.map((property) => property.location.lat);
  const longitudes = properties.map((property) => property.location.lng);

  const centerLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
  const centerLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

  const center: LatLngExpression = [centerLat, centerLng];


  return (
    <div>
      <MapContainer
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
        center={center}
        zoom={10}
        ref={mapRef}
      >
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

export default DashBoardMap;
