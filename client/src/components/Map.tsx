import Image from "@/assets/WorldMapScaled.png";
import { useGlobalStore } from "@/context/GlobalStore";
import { cn } from "@/lib/utils";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
  className?: string;
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
  const [scale, setScale] = useState(
    (imageRef.current && imageRef.current.width / document.body.clientWidth) ||
      1
  );
  const [points, setPoints] = useState<{ lat?: number; lng?: number }[]>([
    {},
    {},
  ]);
  const [centerPoint, setCenterPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const updateImageDimensions = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const renderedWidth = rect.width;
      const renderedHeight = rect.height;
      console.log(renderedHeight);
      console.log(rect.height);
      console.log(window.innerHeight);

      setImageDimensions({
        width: renderedWidth,
        height: renderedHeight,
        offsetX: 0,
        offsetY: 0,
      });
      console.log(scale);
      setScale(window.innerHeight / renderedHeight);
    }
  };
  useLayoutEffect(() => {
    window.addEventListener("resize", updateImageDimensions);
    return () => {
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, []);

  const { arrival_airport, departure_airport } = useGlobalStore();
  useEffect(() => {
    if (departure_airport?.latitude) {
      points[0] = {
        lat: parseFloat(departure_airport.latitude),
        lng: parseFloat(departure_airport.longitude),
      };
    }

    if (arrival_airport?.latitude) {
      points[1] = {
        lat: parseFloat(arrival_airport.latitude),
        lng: parseFloat(arrival_airport.longitude),
      };
    }

    setPoints(points);

    if ((points[1].lat && points[1].lng) || (points[0].lat && points[0].lng)) {
      const { x, y } = MillerProjection(
        (points[0] && points[0]?.lat) || points[1]?.lat || 0,
        (points[0] && points[0]?.lng) || points[1]?.lng || 0,
        imageDimensions.width,
        imageDimensions.height
      );
      setCenterPoint({ x, y });
    }
    if (points[1].lat && points[1].lng && points[0].lat && points[0].lng) {
      const { x, y } = MillerProjection(
        (points[0].lat + points[1].lat) / 2,
        (points[0].lng + points[1].lng) / 2,
        imageDimensions.width,
        imageDimensions.height
      );
      setCenterPoint({ x, y });
    }
  }, [arrival_airport?.latitude, departure_airport?.latitude, imageDimensions]);

  const generatePath = (pointz: { lat?: number; lng?: number }[]) => {
    if (
      pointz[0].lat === undefined ||
      pointz[1].lat === undefined ||
      imageDimensions.width === 0
    )
      return null;
    const points = pointz as { lat: number; lng: number }[];
    const start = points[0];
    const end = points[1];
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
      .map((point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }

        const lngDiff = Math.abs(
          interpolatedPoints[index - 1].lng - interpolatedPoints[index].lng
        );
        const isCrossingDateLine = lngDiff > 180;

        return isCrossingDateLine
          ? `M ${point.x} ${point.y}`
          : `L ${point.x} ${point.y}`;
      })
      .join(" ");

    return pathD;
  };
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{
          scale: scale,
          x: centerPoint ? -centerPoint.x + imageDimensions.width / 2 : 0,
          y: centerPoint ? -centerPoint.y + imageDimensions.height / 2 : 0,
        }}
        transition={{ duration: 1 }}
        style={{ zIndex: -2 }}
      >
        <img
          ref={imageRef}
          src={Image}
          alt="Map"
          className="absolute object-contain"
          onLoad={updateImageDimensions}
        />

        {/* Render Points */}
        {imageDimensions.width > 0 &&
          imageDimensions.height > 0 &&
          points.map((point, index) => {
            if (!(point?.lat && point?.lng)) return;
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
                  width: "3px",
                  height: "3px",
                  left: `${x + imageDimensions.offsetX}px`,
                  top: `${y + imageDimensions.offsetY}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              />
            );
          })}

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
      </motion.div>
      <div className="w-full h-full relative">{children}</div>
    </div>
  );
};

export default MapComponent;
