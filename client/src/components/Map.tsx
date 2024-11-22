import Image from "@/assets/WorldMapScaled.png";
import { useGlobalStore } from "@/context/GlobalStore";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

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
  var bottomOffset =
    -1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * mapLatBottomRadian));
  var bottomOffsetScaled = bottomOffset * scale;

  y -= bottomOffsetScaled * -0.33;

  return { x, y };
}

function interpolateGreatCircle(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  numPoints: number = 100
): { lat: number; lng: number }[] {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lng);
  const lat2 = toRadians(end.lat);
  const lon2 = toRadians(end.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.pow(Math.sin((lon2 - lon1) / 2), 2)
      )
    );

  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);
    points.push({ lat: toDegrees(lat), lng: toDegrees(lon) });
  }

  return points;
}

interface MapComponentProps {
  className: string;
  children: React.ReactNode;
}

const MapComponent: React.FC<MapComponentProps> = ({ className, children }) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
    offsetY: 0,
    offsetX: 0,
  });
  const [points, setPoints] = useState<{ lat: number; lng: number }[]>([]);

  const updateImageDimensions = () => {
    if (imageRef.current) {
      const naturalAspectRatio =
        imageRef.current.naturalWidth / imageRef.current.naturalHeight;

      const rect = imageRef.current.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      let renderedWidth, renderedHeight;
      if (containerWidth / containerHeight < naturalAspectRatio) {
        renderedHeight = containerHeight;
        renderedWidth = containerHeight * naturalAspectRatio;
      } else {
        renderedWidth = containerWidth;
        renderedHeight = containerWidth / naturalAspectRatio;
      }

      const offsetX = (containerWidth - renderedWidth) / 2;
      const offsetY = (containerHeight - renderedHeight) / 2;

      setImageDimensions({
        width: renderedWidth,
        height: renderedHeight,
        offsetX,
        offsetY,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateImageDimensions, 0);
    window.addEventListener("resize", updateImageDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, []);

  const { arrival_airport, departure_airport } = useGlobalStore();
  useEffect(() => {
    if (arrival_airport?.latitude) {
      const temp = {
        lat: Number(arrival_airport.latitude),
        lng: Number(arrival_airport.longitude),
      };
      setPoints((prevPoints) => [
        ...prevPoints,
        {
          lat: temp.lat,
          lng: temp.lng,
        },
      ]);
    }
  }, [arrival_airport]);

  useEffect(() => {
    if (departure_airport?.latitude) {
      const temp = {
        lat: Number(departure_airport.latitude),
        lng: Number(departure_airport.longitude),
      };
      setPoints((prevPoints) => [
        ...prevPoints,
        {
          lat: temp.lat,
          lng: temp.lng,
        },
      ]);
    }
  }, [departure_airport]);

  const generatePath = (points: { lat: number; lng: number }[]) => {
    if (points.length < 2 || imageDimensions.width === 0) return null;

    const start = points[0];
    const end = points[1];
    console.log(points);
    const interpolatedPoints = interpolateGreatCircle(start, end, 100);

    const projectedPoints = interpolatedPoints.map(
      ({ lat, lng }: { lat: number; lng: number }) =>
        MillerProjection(
          lat,
          lng,
          imageDimensions.width,
          imageDimensions.height
        )
    );

    const pathD = projectedPoints
      .map((point, index, arr) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`; // Start the path
        }

        // Detect if there is a large jump in longitude (crossing the Date Line)
        const prevPoint = arr[index - 1];
        const lngDiff = Math.abs(
          interpolatedPoints[index - 1].lng - interpolatedPoints[index].lng
        );
        const isCrossingDateLine = lngDiff > 180;

        return isCrossingDateLine
          ? `M ${point.x} ${point.y}` // Pen up: move without drawing
          : `L ${point.x} ${point.y}`; // Pen down: draw line
      })
      .join(" ");

    return pathD;
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imageRef}
        src={Image}
        alt="Map"
        className="absolute w-full h-full object-cover"
        style={{ zIndex: -2 }}
      />

      {/* Render Points */}
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
                left: `${x + imageDimensions.offsetX}px`,
                top: `${y + imageDimensions.offsetY}px`,
                transform: "translate(-50%, -50%)",
                zIndex: -1,
              }}
            />
          );
        })}

      {/* Render Path */}
      {points.length >= 2 && (
        <svg
          className="absolute"
          style={{
            left: `${imageDimensions.offsetX}px`,
            top: `${imageDimensions.offsetY}px`,
            width: `${imageDimensions.width}px`,
            height: `${imageDimensions.height}px`,
            zIndex: -1,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={generatePath(points) || ""}
            fill="none"
            stroke="var(--theme-primary-darker)"
            strokeWidth="2"
          />
        </svg>
      )}

      {children}
    </div>
  );
};

export default MapComponent;
