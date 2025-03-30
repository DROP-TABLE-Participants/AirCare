"use client";  // Ensure this is a client-side component

import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';  // Import ReactMapGL from react-map-gl
import 'mapbox-gl/dist/mapbox-gl.css';  // Import Mapbox CSS for styling
import { Marker, Source, Layer } from 'react-map-gl/mapbox';  // Import Marker, Source, and Layer

// Your Mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYm5zYXZvdiIsImEiOiJjbTh1OXpoMmkwbDAxMmtwZXd3NmJudnJ3In0.fgJhJlS6iYaQmdWvoOhYiw';

interface MapWidgetProps {
  start?: [number, number];
  end?: [number, number];
  startName?: string;
  endName?: string;
}

const MapWidget: React.FC<MapWidgetProps> = ({ 
  start = [23.3219, 42.6977],  // Default: Sofia, Bulgaria (Start)
  end = [13.4050, 52.5200],    // Default: Berlin, Germany (End)
  startName = "Start",
  endName = "End" 
}) => {
  const calculateZoomLevel = (start: [number, number], end: [number, number]) => {
    const latDiff = Math.abs(start[1] - end[1]);
    const lngDiff = Math.abs(start[0] - end[0]);

    // Simple heuristic to set zoom level based on distance
    const zoom = Math.min(12 - latDiff - lngDiff, 10);  // Adjust zoom range based on the difference
    return (zoom > 2 ? zoom : 2) - .5; // Ensure a minimum zoom level of 2
  };

  // Initial viewport settings
  const [viewport, setViewport] = useState({
    longitude: (start[0] + end[0]) / 2,  // Center the map between start and end points
    latitude: (start[1] + end[1]) / 2,
    zoom: calculateZoomLevel(start, end),
  });

  // Update viewport when start or end points change
  useEffect(() => {
    setViewport({
      longitude: (start[0] + end[0]) / 2,
      latitude: (start[1] + end[1]) / 2,
      zoom: calculateZoomLevel(start, end),
    });
  }, [start, end]);

  // GeoJSON for the flight path (LineString)
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [start, end],  // Path from start to end
        },
      },
    ],
  };

  return (
    <Map
      initialViewState={viewport}  // Use the calculated viewport
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {/* Marker for Start */}
      <Marker longitude={start[0]} latitude={start[1]}>
        <div className="text-xl text-red-600" title={startName}>🛫</div>
      </Marker>

      {/* Marker for End */}
      <Marker longitude={end[0]} latitude={end[1]}>
        <div className="text-xl text-green-600" title={endName}>🛬</div>
      </Marker>

      {/* Flight Path */}
      <Source id="flight-path" type="geojson" data={geojson}>
        <Layer
          id="flight-path-line"
          type="line"
          paint={{
            'line-color': '#ff0000',  // Red color for the path
            'line-width': 3,  // Line thickness
          }}
        />
      </Source>
    </Map>
  );
};

export default MapWidget;
