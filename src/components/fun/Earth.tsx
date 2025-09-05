import * as THREE from "three";
import Globe, { GlobeMethods } from "react-globe.gl";
import { use, useEffect, useMemo, useRef, useState } from "react";

export const Earth = (props: { style: React.CSSProperties }) => {
  const [polygonsData, setPolygonsData] = useState<any>(null);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    fetch("/visited_countries.geojson")
      .then((res) => res.json())
      .then((data) => setPolygonsData(data));
  }, []);

  useEffect(() => {
    const globe = globeEl.current;
    if (!globe) return;

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;
  }, []);

  useEffect(() => {
    const globe = globeEl.current;
    if (!globe) return;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableZoom = false;
  }, [globeEl.current]);

  return (
    <div
      className="absolute w-60 h-60 flex flex-col items-center"
      style={{
        ...props.style,
        transform: "translate(50%, -50%)",
      }}
    >
      <div
        className=" w-full h-full"
        style={{ filter: "brightness(1.3)", transform: "rotate(23.44deg)" }}
      >
        <Globe
          ref={globeEl}
          animateIn={false}
          backgroundColor="#00000000"
          atmosphereColor="#545454"
          atmosphereAltitude={0.2}
          width={256}
          height={256}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
          polygonsData={polygonsData}
          polygonCapColor={"#00000000"}
          polygonSideMaterial={
            new THREE.MeshBasicMaterial({
              color: "#ffdd47",
              wireframe: true,
              wireframeLinewidth: 5,
            })
          }
        />
      </div>
      <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-3 whitespace-nowrap inline-flex items-center gap-1">
        PLACES I'VE VISITED
      </p>
    </div>
  );
};
