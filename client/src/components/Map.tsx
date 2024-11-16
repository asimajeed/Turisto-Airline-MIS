import Image from "@/assets/MapChart_Map.png";
import React from "react";

// const mercatorProjection = (
//   lat: number,
//   lng: number,
//   mapWidth: number,
//   mapHeight: number,
//   maxSouth: number,
//   maxWest: number,
//   maxEast: number
// ): { x: number; y: number } => {
//   const x = ((lng - maxWest) / (maxEast - maxWest)) * mapWidth;
//   const latRad = toRadians(lat);
//   const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
//   const adjustedMapHeight =
//     mapHeight / Math.log(Math.tan(Math.PI / 4 + toRadians(maxSouth) / 2));
//   const y = mapHeight / 2 - (adjustedMapHeight * mercN) / (2 * Math.PI);
//   console.log(`x = ${x} y = ${y}`);
//   return { x, y };
// };

function mercatorProjection(
  latitude: number,
  longitude: number,
  mapWidth: number, // in pixels
  mapHeight: number // in pixels
) {
  const mapLngLeft = -180; // in degrees. the longitude of the left side of the map (i.e. the longitude of whatever is depicted on the left-most part of the map image)
  const mapLngRight = 180; // in degrees. the longitude of the right side of the map
  const mapLatBottom = -58;
  // in degrees.  the latitude of the bottom of the map
  const mapLatBottomRad = (mapLatBottom * Math.PI) / 180;
  const latitudeRad = (latitude * Math.PI) / 180;
  const mapLngDelta = mapLngRight - mapLngLeft;

  const worldMapWidth = ((mapWidth / mapLngDelta) * 360) / (2 * Math.PI);
  const mapOffsetY =
    (worldMapWidth / 2) *
    Math.log((1 + Math.sin(mapLatBottomRad)) / (1 - Math.sin(mapLatBottomRad)));

  const x = (longitude - mapLngLeft) * (mapWidth / mapLngDelta);
  const y =
    mapHeight -
    ((worldMapWidth / 2) *
      Math.log((1 + Math.sin(latitudeRad)) / (1 - Math.sin(latitudeRad))) -
      mapOffsetY);

  return { x, y }; // the pixel x,y value of this point on the map image
}

interface MapComponentProps {
  mapWidth: number;
  mapHeight: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapWidth, mapHeight }) => {
  const maxSouth = -60;
  const maxEast = 180;
  const maxWest = -180;
  const maxNorth = 90;
  const gridSpacing = 30; // Adjust the spacing between points

  const points = [];

  for (let lat = maxNorth; lat >= maxSouth; lat -= gridSpacing) {
    for (let lng = maxWest; lng <= maxEast; lng += gridSpacing) {
      points.push({ lat, lng });
    }
  }
  points.push(
    { lat: 24.8, lng: 67.0 },
    { lat: -33.922, lng: 18.423 },
    { lat: 64.84, lng: -147.72 }
  );
  return (
    <div
      className="relative bg-cover bg-left-top bg-no-repeat mb-20"
      style={{
        backgroundImage: `url(${Image})`,
        backgroundBlendMode: "exclusion",
        backgroundSize: "100% 100%",
        height: `${mapHeight}px`,
        width: `${mapWidth}px`,
      }}
    >
      {points.map((point, index) => {
        const { x, y } = mercatorProjection(point.lat, point.lng, mapWidth, mapHeight);
        return (
          <div
            key={index}
            className="absolute bg-red-500 rounded-full"
            style={{
              width: "5px",
              height: "5px",
              left: `${x}px`,
              top: `${y}px`,
              transform: "translate(-50%, -50%)",
            }}
            children={
              <p>
                {point.lat},{point.lng}
              </p>
            }
          />
        );
      })}
    </div>
  );
};

export default MapComponent;
