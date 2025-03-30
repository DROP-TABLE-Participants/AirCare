"use client";

import React, { useState, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Marker, Source, Layer } from 'react-map-gl/mapbox';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYm5zYXZvdiIsImEiOiJjbTh1OXpoMmkwbDAxMmtwZXd3NmJudnJ3In0.fgJhJlS6iYaQmdWvoOhYiw';

interface MapWidgetProps {
  start?: [number, number];
  end?: [number, number];
  startName?: string;
  endName?: string;
}

const MapWidget: React.FC<MapWidgetProps> = ({ 
  start = [23.3219, 42.6977],
  end = [13.4050, 52.5200],
  startName = "Start",
  endName = "End" 
}) => {
  const calculateZoomLevel = (start: [number, number], end: [number, number]) => {
    const latDiff = Math.abs(start[1] - end[1]);
    const lngDiff = Math.abs(start[0] - end[0]);

    const zoom = Math.min(12 - latDiff - lngDiff, 10);
    return (zoom > 2 ? zoom : 2) - .5;
  };

  const [viewport, setViewport] = useState({
    longitude: (start[0] + end[0]) / 2,
    latitude: (start[1] + end[1]) / 2,
    zoom: calculateZoomLevel(start, end),
  });

  useEffect(() => {
    setViewport({
      longitude: (start[0] + end[0]) / 2,
      latitude: (start[1] + end[1]) / 2,
      zoom: calculateZoomLevel(start, end),
    });
  }, [start, end]);

  const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [start, end],
        },
        properties: {},
      },
    ],
  };

  const mapContainerStyle = {
    borderRadius: '1rem',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  };

  return (
    <div className="map-container" style={mapContainerStyle}>
      <Map
        initialViewState={viewport}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <Marker longitude={start[0]} latitude={start[1]}>
          <div className="text-xl text-red-600" title={startName}>🛫</div>
        </Marker>

        <Marker longitude={end[0]} latitude={end[1]}>
          <div className="text-xl text-green-600" title={endName}>🛬</div>
        </Marker>

        <Source id="flight-path" type="geojson" data={geojson}>
          <Layer
            id="flight-path-line"
            type="line"
            paint={{
              'line-color': '#ff0000',
              'line-width': 3,
            }}
          />
        </Source>
      </Map>
      <style jsx>{`
        @media (min-width: 768px) {
          .map-container {
            min-height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MapWidget;
