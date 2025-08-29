import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Keyboard.module.css";
import clsx from "clsx";

const getElementByNote = (note: string) =>
  note && document.querySelector(`[data-note="${note}"]`);

const getHz = (note = "A", octave = 4) => {
  const A4 = 440;
  let N = 0;
  switch (note) {
    default:
    case "A":
      N = 0;
      break;
    case "A#":
    case "Bb":
      N = 1;
      break;
    case "B":
      N = 2;
      break;
    case "C":
      N = 3;
      break;
    case "C#":
    case "Db":
      N = 4;
      break;
    case "D":
      N = 5;
      break;
    case "D#":
    case "Eb":
      N = 6;
      break;
    case "E":
      N = 7;
      break;
    case "F":
      N = 8;
      break;
    case "F#":
    case "Gb":
      N = 9;
      break;
    case "G":
      N = 10;
      break;
    case "G#":
    case "Ab":
      N = 11;
      break;
  }
  N += 12 * (octave - 4);
  return A4 * Math.pow(2, N / 12);
};

const keys = {
  A: { note: "C", octaveOffset: 0 },
  W: { note: "C#", octaveOffset: 0 },
  S: { note: "D", octaveOffset: 0 },
  E: { note: "D#", octaveOffset: 0 },
  D: { note: "E", octaveOffset: 0 },
  F: { note: "F", octaveOffset: 0 },
  T: { note: "F#", octaveOffset: 0 },
  G: { note: "G", octaveOffset: 0 },
  Y: { note: "G#", octaveOffset: 0 },
  H: { note: "A", octaveOffset: 1 },
  U: { note: "A#", octaveOffset: 1 },
  J: { note: "B", octaveOffset: 1 },
  K: { note: "C", octaveOffset: 1 },
  O: { note: "C#", octaveOffset: 1 },
  L: { note: "D", octaveOffset: 1 },
  P: { note: "D#", octaveOffset: 1 },
  semicolon: { note: "E", octaveOffset: 1 },
};

export default function Keyboard(props: { style: React.CSSProperties }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [activeNotes, setActiveNotes] = useState<Map<string, OscillatorNode>>(
    new Map()
  );

  useEffect(() => {
    audioContextRef.current = new AudioContext();
  }, []);

  const playNote = useCallback(
    (key: string) => {
      const audioContext = audioContextRef.current;

      if (!audioContext) {
        return;
      }

      const osc = audioContext.createOscillator();
      const noteGainNode = audioContext.createGain();
      noteGainNode.connect(audioContext.destination);

      const zeroGain = 0.00001;
      const maxGain = 0.5;
      const sustainedGain = 0.001;

      noteGainNode.gain.value = zeroGain;

      const setAttack = () =>
        noteGainNode.gain.exponentialRampToValueAtTime(
          maxGain,
          audioContext.currentTime + 0.01
        );
      const setDecay = () =>
        noteGainNode.gain.exponentialRampToValueAtTime(
          sustainedGain,
          audioContext.currentTime + 1
        );
      const setRelease = () =>
        noteGainNode.gain.exponentialRampToValueAtTime(
          zeroGain,
          audioContext.currentTime + 0.5
        );

      setAttack();
      setDecay();
      setRelease();

      osc.connect(noteGainNode);
      osc.type = "triangle";

      const freq = getHz(
        keys[key as keyof typeof keys].note,
        (keys[key as keyof typeof keys].octaveOffset || 0) + 3
      );

      if (Number.isFinite(freq)) {
        osc.frequency.value = freq;
      }

      osc.start();
      setActiveNotes((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, osc);
        return newMap;
      });
    },
    [audioContextRef]
  );

  const stopNote = useCallback(
    (key: string) => {
      const audioContext = audioContextRef.current;
      if (!audioContext) {
        return;
      }

      const osc = activeNotes.get(key);

      if (osc) {
        osc.stop();
      }

      setActiveNotes((prev) => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    },
    [audioContextRef, activeNotes]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const eventKey = e.key.toUpperCase();
      const key = eventKey === ";" ? "semicolon" : eventKey;

      if (!key || activeNotes.has(key)) {
        return;
      }

      if (!keys[key as keyof typeof keys]) {
        return;
      }

      playNote(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const eventKey = e.key.toUpperCase();
      const key = eventKey === ";" ? "semicolon" : eventKey;

      stopNote(key);
    };

    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeNotes, audioContextRef]);

  const noteStyles = useCallback(
    (className: string | string[], note: string) => {
      return clsx(className, activeNotes.has(note) && styles.pressed);
    },
    [activeNotes]
  );

  return (
    <div
      className="absolute z-30"
      style={{
        ...props.style,
        transform: "translate(-65%, -50%) rotate(10deg)",
      }}
    >
      <ul id={styles.keyboard} className="inline-flex font-sans font-bold p-2">
        <li
          data-note="C"
          className={noteStyles(styles.white, "A")}
          onMouseDown={() => playNote("A")}
          onMouseUp={() => stopNote("A")}
          onMouseLeave={() => stopNote("A")}
        >
          A
        </li>
        <li
          data-note="C#"
          className={noteStyles(styles.black, "W")}
          onMouseDown={() => playNote("W")}
          onMouseUp={() => stopNote("W")}
          onMouseLeave={() => stopNote("W")}
        >
          W
        </li>
        <li
          data-note="D"
          className={noteStyles([styles.white, styles.offset], "S")}
          onMouseDown={() => playNote("S")}
          onMouseUp={() => stopNote("S")}
          onMouseLeave={() => stopNote("S")}
        >
          S
        </li>
        <li
          data-note="D#"
          className={noteStyles(styles.black, "E")}
          onMouseDown={() => playNote("E")}
          onMouseUp={() => stopNote("E")}
          onMouseLeave={() => stopNote("E")}
        >
          E
        </li>
        <li
          data-note="E"
          className={noteStyles([styles.white, styles.offset], "D")}
          onMouseDown={() => playNote("D")}
          onMouseUp={() => stopNote("D")}
          onMouseLeave={() => stopNote("D")}
        >
          D
        </li>
        <li
          data-note="F"
          className={noteStyles(styles.white, "F")}
          onMouseDown={() => playNote("F")}
          onMouseUp={() => stopNote("F")}
          onMouseLeave={() => stopNote("F")}
        >
          F
        </li>
        <li
          data-note="F#"
          className={noteStyles(styles.black, "T")}
          onMouseDown={() => playNote("T")}
          onMouseUp={() => stopNote("T")}
          onMouseLeave={() => stopNote("T")}
        >
          T
        </li>
        <li
          data-note="G"
          className={noteStyles([styles.white, styles.offset], "G")}
          onMouseDown={() => playNote("G")}
          onMouseUp={() => stopNote("G")}
          onMouseLeave={() => stopNote("G")}
        >
          G
        </li>
        <li
          data-note="G#"
          className={noteStyles(styles.black, "Y")}
          onMouseDown={() => playNote("Y")}
          onMouseUp={() => stopNote("Y")}
          onMouseLeave={() => stopNote("Y")}
        >
          Y
        </li>
        <li
          data-note="A"
          className={noteStyles([styles.white, styles.offset], "H")}
          onMouseDown={() => playNote("H")}
          onMouseUp={() => stopNote("H")}
          onMouseLeave={() => stopNote("H")}
        >
          H
        </li>
        <li
          data-note="A#"
          className={noteStyles(styles.black, "U")}
          onMouseDown={() => playNote("U")}
          onMouseUp={() => stopNote("U")}
          onMouseLeave={() => stopNote("U")}
        >
          U
        </li>
        <li
          data-note="B"
          className={noteStyles([styles.white, styles.offset], "J")}
          onMouseDown={() => playNote("J")}
          onMouseUp={() => stopNote("J")}
          onMouseLeave={() => stopNote("J")}
        >
          J
        </li>
        <li
          data-note="C2"
          className={noteStyles(styles.white, "K")}
          onMouseDown={() => playNote("K")}
          onMouseUp={() => stopNote("K")}
          onMouseLeave={() => stopNote("K")}
        >
          K
        </li>
        <li
          data-note="C#2"
          className={noteStyles(styles.black, "O")}
          onMouseDown={() => playNote("O")}
          onMouseUp={() => stopNote("O")}
          onMouseLeave={() => stopNote("O")}
        >
          O
        </li>
        <li
          data-note="D2"
          className={noteStyles([styles.white, styles.offset], "L")}
          onMouseDown={() => playNote("L")}
          onMouseUp={() => stopNote("L")}
          onMouseLeave={() => stopNote("L")}
        >
          L
        </li>
        <li
          data-note="D#2"
          className={noteStyles(styles.black, "P")}
          onMouseDown={() => playNote("P")}
          onMouseUp={() => stopNote("P")}
          onMouseLeave={() => stopNote("P")}
        >
          P
        </li>
        <li
          data-note="E2"
          className={noteStyles([styles.white, styles.offset], "semicolon")}
          onMouseDown={() => playNote("semicolon")}
          onMouseUp={() => stopNote("semicolon")}
          onMouseLeave={() => stopNote("semicolon")}
        >
          ;
        </li>
      </ul>
      <p className="text-center font-sans text-sm text-gray-400 font-semibold">
        PLAY A TUNE
      </p>
    </div>
  );
}
