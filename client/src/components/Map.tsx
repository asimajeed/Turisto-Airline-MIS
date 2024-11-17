import Image from "@/assets/WorldMapScaled.png";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

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

function MillerProjection(
  latitude: number,
  longitude: number,
  mapWidth: number, // in pixels
  mapHeight: number // in pixels
): { x: number; y: number } {
  // Function to convert degrees to radians
  function toRadian(value: number) {
    return (value * Math.PI) / 180;
  }

  const lng = toRadian(longitude);
  const lat = toRadian(latitude);

  // Miller Projection formula
  var x = lng;
  var y = -1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat));

  // Scaling based on the map dimensions
  var width = mapWidth;
  var height = mapHeight;
  var scale = width / (2 * Math.PI);
  x = x * scale + width / 2;
  y = y * scale + height / 2;

  // Adjusting based on mapLatBottom
  var mapLatBottom = -60; // Bottom-most latitude
  var mapLatBottomRadian = toRadian(mapLatBottom);
  var bottomOffset = -1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * mapLatBottomRadian));
  var bottomOffsetScaled = bottomOffset * scale;

  y -= bottomOffsetScaled * -0.33;

  return { x, y };
}

interface MapComponentProps {
  className: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ className }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 100, height: 100 });

  const updateImageDimensions = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImageDimensions({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateImageDimensions();
    }, 0); // Delay for ref to be available
    window.addEventListener("resize", updateImageDimensions);
    return () => {
      clearTimeout(timer); // Clear timeout on unmount
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, []);

  const points = [
    { lat: 24.8, lng: 67.0 },
    { lat: -33.922, lng: 18.423 },
    { lat: 64.84, lng: -147.72 },
  ];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img ref={imageRef} src={Image} alt="Map" className="w-full h-auto" />
      {imageDimensions.width > 0 &&
        imageDimensions.height > 0 &&
        points.map((point, index) => {
          const { x, y } = MillerProjection(
            point.lat,
            point.lng,
            imageDimensions.width,
            imageDimensions.height
          );
          return (
            <div
              key={index}
              className="absolute bg-foreground rounded-full"
              style={{
                width: "5px",
                height: "5px",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
    </div>
  );
};

export default MapComponent;
