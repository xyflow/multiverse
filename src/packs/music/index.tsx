import ReactFlow from "@flows/ReactFlow.tsx";
import Multiverse from "@flows/Multiverse";

import type { Sample } from "@utils/paths.ts";

import Adsr from "./adsr/Adsr.tsx";
import Amp from "./amp/Amp.tsx";
import Osc from "./osc/Osc.tsx";
import Xy from "./xy/Xy.tsx";

import ButtonEdge from "./buttonedge/ButtonEdge.tsx";

export const flowConfig: ReactFlowConfig = {
  flowProps: {
    nodes: [
      {
        id: "1",
        data: {
          frequency: 220,
          waveform: "triangle",
        },
        position: { x: 250, y: 0 },
        type: "Osc",
      },
      {
        id: "2",
        data: {
          attack: 200,
          decay: 600,
          sustain: 0.5,
          release: 100,
        },
        position: { x: 500, y: 175 },
        type: "Adsr",
      },
      {
        id: "3",
        data: {
          x: 0.5,
          y: 0.5,
        },
        position: { x: 125, y: 250 },
        type: "Xy",
      },
      {
        id: "4",
        data: {
          gain: 0.5,
        },
        position: { x: 850, y: 400 },
        type: "Amp",
      },
    ],
    edges: [
      { id: "1->2", source: "1", target: "2", targetHandle: "in" },
      { id: "2->4", source: "2", target: "4", targetHandle: "in" },
      {
        id: "3->4",
        source: "3",
        target: "4",
        type: "ButtonEdge",
        data: {
  title: "ButtonEdge",
  description: "An edge with a button, what do you think it does?",
},
        sourceHandle: "y",
        targetHandle: "gain",
      },
    ],
    nodeTypes: {
      Adsr,
      Amp,
      Osc,
      Xy,
    },
    edgeTypes: {
      ButtonEdge
    },
    fitView: true,
  },
  backgroundProps: {},
};

// This boilerplate is sadly necessary
export default () => <ReactFlow flowConfig={flowConfig} />;

// This boilerplate is not necessary but Astro is weird
// (no functions allowed in props...)
export function MultiverseFlow({
  samples,
  initialLocation,
}: {
  samples: Record<string, Sample>;
  initialLocation: string;
}) {
  return (
    <Multiverse
      samples={samples}
      flowConfig={flowConfig}
      initialLocation={initialLocation}
      pack="music"
    />
  );
}
