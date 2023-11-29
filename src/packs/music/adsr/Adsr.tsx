import { useCallback, useState } from "react";
import {
  type NodeProps,
  Handle,
  Position,
  useReactFlow,
  useStore,
} from "reactflow";

// Prune
export const meta = {
  title: "ADSR",
  description: `
    An ADSR envelope generator. Use the sliders to adjust the attack, decay,
    sustain level, and release time. 
  `
};


/**
 *
 */
export type AdsrData = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type Param = "attack" | "decay" | "sustain" | "release";

/**
 *
 */
export function Adsr({ id, data }: NodeProps<AdsrData>) {
  const { setNodes } = useReactFlow();
  const [focusedParam, setFocusedParam] = useState<Param | null>(null);
  const hasIncomers = useStore(
    ({ edges }) =>
      ({
        in: edges.some(
          ({ target, targetHandle }) => target === id && targetHandle === "in"
        ),
        gate: edges.some(
          ({ target, targetHandle }) => target === id && targetHandle === "gate"
        ),
      }) as const
  );
  const hasOutgoers = useStore(({ edges }) =>
    edges.some(({ source }) => source === id)
  );

  const updateNodeData = useCallback((data: Partial<AdsrData>) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, []);

  return (
    <div className="bg-white shadow-lg [&>*]:px-2 [&>*]:py-1">
      <header className="bg-gray-100 rounded-t-lg text-xs">
        <div
          className={`relative -mx-1.5 px-2 ${
            hasIncomers.gate ? "opacity-100" : "opacity-25"
          }`}
        >
          <span>gate</span>
          <Handle position={Position.Left} type="target" id="gate" />
        </div>
        <div
          className={`relative -mx-1.5 px-2 ${
            hasIncomers.in ? "opacity-100" : "opacity-25"
          }`}
        >
          <span>in</span>
          <Handle position={Position.Left} type="target" id="in" />
        </div>
      </header>

      <div className="m-2 rounded bg-gray-50 shadow-inner text-pink-500">
        <svg className="w-full" viewBox="-5 -5 410 110" width="220">
          {toPathSegments(data).map(({ param, from, to }) => (
            <path
              key={param}
              className={
                param === focusedParam ? "text-pink-500" : "text-black"
              }
              d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
              stroke="currentColor"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      <label
        className="flex gap-2 rounded ring-inset ring-pink-500 focus-within:ring-2"
        onMouseEnter={() => setFocusedParam("attack")}
        onMouseLeave={() => setFocusedParam(null)}
      >
        <p className="text-xs text-right">attack</p>
        <input
          className="nodrag nopan col-span-2"
          type="range"
          min={0}
          max={1000}
          value={data.attack}
          onChange={(e) => updateNodeData({ attack: Number(e.target.value) })}
          onFocus={() => setFocusedParam("attack")}
          onBlur={() => setFocusedParam(null)}
        />
        <span className="text-xs">{data.attack}ms</span>
      </label>

      <label
        className="flex gap-2 rounded ring-inset ring-pink-500 focus-within:ring-2"
        onMouseEnter={() => setFocusedParam("decay")}
        onMouseLeave={() => setFocusedParam(null)}
      >
        <p className="text-xs text-right">decay</p>
        <input
          className="nodrag nopan col-span-2"
          type="range"
          min={0}
          max={1000}
          value={data.decay}
          onChange={(e) => updateNodeData({ decay: Number(e.target.value) })}
          onFocus={() => setFocusedParam("decay")}
          onBlur={() => setFocusedParam(null)}
        />
        <span className="text-xs">{data.decay}ms</span>
      </label>

      <label
        className="flex gap-2 rounded ring-inset ring-pink-500 focus-within:ring-2"
        onMouseEnter={() => setFocusedParam("sustain")}
        onMouseLeave={() => setFocusedParam(null)}
      >
        <p className="text-xs text-right">sustain</p>
        <input
          className="nodrag nopan col-span-2"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={data.sustain}
          onChange={(e) => updateNodeData({ sustain: Number(e.target.value) })}
          onFocus={() => setFocusedParam("sustain")}
          onBlur={() => setFocusedParam(null)}
        />
        <span className="text-xs">{data.sustain}</span>
      </label>

      <label
        className="flex gap-2 rounded ring-inset ring-pink-500 focus-within:ring-2"
        onMouseEnter={() => setFocusedParam("release")}
        onMouseLeave={() => setFocusedParam(null)}
      >
        <p className="text-xs text-right">release</p>
        <input
          className="nodrag nopan col-span-2"
          type="range"
          min={0}
          max={1000}
          value={data.release}
          onChange={(e) => updateNodeData({ release: Number(e.target.value) })}
          onFocus={() => setFocusedParam("release")}
          onBlur={() => setFocusedParam(null)}
        />
        <span className="text-xs">{data.release}ms</span>
      </label>

      <footer className="bg-gray-100 rounded-b-lg text-xs">
        <div
          className={`relative text-right -mx-2 px-2 ${
            hasOutgoers ? "opacity-100" : "opacity-25"
          }`}
        >
          <span>out</span>
          <Handle position={Position.Right} type="source" />
        </div>
      </footer>
    </div>
  );
}

export default Adsr;

//
const toPathSegments = ({ attack, decay, sustain, release }: AdsrData) => {
  const sustainY = 100 - sustain * 100;
  const segments = [
    { x: 0, y: 100 },
    { x: attack / 10, y: 0 },
    { x: attack / 10 + decay / 10, y: sustainY },
    { x: attack / 10 + decay / 10 + 100, y: sustainY },
    { x: attack / 10 + decay / 10 + 100 + release / 10, y: 100 },
  ];

  return [
    { param: "attack", from: segments[0], to: segments[1] },
    { param: "decay", from: segments[1], to: segments[2] },
    { param: "sustain", from: segments[2], to: segments[3] },
    { param: "release", from: segments[3], to: segments[4] },
  ] as const;
};
