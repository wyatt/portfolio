import * as THREE from "three";
import Globe, { GlobeMethods } from "react-globe.gl";
import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Created once: a new material every render makes the globe rebuild its polygons
const POLYGON_SIDE_MATERIAL = new THREE.MeshBasicMaterial({
  color: "#ff8c1a",
  wireframe: true,
  wireframeLinewidth: 5,
});
const polygonCapColor = () => "rgba(255, 140, 26, 0.45)";

export const Earth = memo(function Earth(props: {
  style: React.CSSProperties;
  shouldAnimate: boolean;
  incrementStep: () => void;
  onReady?: () => void;
}) {
  const [polygonsData, setPolygonsData] = useState<object[] | null>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    fetch("/visited_countries.geojson")
      .then((res) => res.json())
      .then((data) => setPolygonsData(data));
  }, []);

  // onGlobeReady fires once the map texture has loaded. Wait for the countries
  // too, then a couple of frames so shaders compile and textures upload before
  // the globe zooms in, rather than during it.
  useEffect(() => {
    if (!isGlobeReady || !polygonsData) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsReady(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isGlobeReady, polygonsData]);

  const { onReady } = props;
  useEffect(() => {
    if (isReady) onReady?.();
  }, [isReady, onReady]);

  // Stop rendering while hidden; wait for the zoom-out to finish first
  useEffect(() => {
    const globe = globeEl.current;
    if (!globe || !isReady) return;
    if (props.shouldAnimate) {
      globe.resumeAnimation();
      return;
    }
    const timer = setTimeout(() => globe.pauseAnimation(), 600);
    return () => clearTimeout(timer);
  }, [props.shouldAnimate, isReady]);

  const isShown = props.shouldAnimate && isReady;

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
        scale: isShown ? 1 : 0,
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
        if (isShown) {
          props.incrementStep();
        }
      }}
    >
      <div
        className=" w-full h-full"
        style={{ transform: "rotate(23.44deg)" }}
      >
        <Globe
          ref={globeEl}
          animateIn={false}
          backgroundColor="#00000000"
          atmosphereColor="#545454"
          atmosphereAltitude={0.2}
          width={256}
          height={256}
          globeImageUrl="/fun/earth-natural.jpg"
          onGlobeReady={() => {
            const globe = globeEl.current;
            if (globe) {
              const controls = globe.controls();
              controls.autoRotate = true;
              controls.autoRotateSpeed = 0.5;
              controls.enableZoom = false;
              globe.pointOfView({ lat: 35, lng: 30, altitude: 2.25 });
            }
            setIsGlobeReady(true);
          }}
          polygonsData={polygonsData || []}
          // Countries appear at once instead of rising over a second
          polygonsTransitionDuration={0}
          polygonCapColor={polygonCapColor}
          polygonSideMaterial={POLYGON_SIDE_MATERIAL}
        />
      </div>
      <p className="font-sans text-sm text-gray-400 font-semibold uppercase z-30 absolute -bottom-3 whitespace-nowrap inline-flex items-center gap-1">
        PLACES I'VE VISITED
      </p>
    </motion.div>
  );
});
