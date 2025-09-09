import * as THREE from "three";
import Globe, { GlobeMethods } from "react-globe.gl";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

export const Earth = (props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
}) => {
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
    globe.pointOfView({ lat: 35, lng: 0, altitude: 2.25 });
  }, [globeEl.current]);

  const isReady = useMemo(() => {
    return props.shouldAnimate && globeEl.current && polygonsData;
  }, [props.shouldAnimate, polygonsData, globeEl.current]);

  return (
    <motion.div
      className="absolute w-60 h-60 flex flex-col items-center"
      style={{
        ...props.style,
        transform: "translate(50%, -50%)",
      }}
      initial={{
        scale: 0,
        opacity: 0,
        x: "50%",
        y: "-50%",
      }}
      animate={{
        scale: isReady ? 1 : 0,
        opacity: 1,
        x: "50%",
        y: "-50%",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onAnimationComplete={() => {
        if (isReady) {
          props.incrementStep();
        }
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
          polygonsData={polygonsData || []}
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
    </motion.div>
  );
};
