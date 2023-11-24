import ReactFlow from "@flows/ReactFlow.tsx";
import Multiverse from "@flows/Multiverse/MultiverseFlow.tsx";

import Oscilloscope from "./oscilloscope/Oscilloscope.tsx";
import ButtonEdge from "./buttonedge/ButtonEdge.tsx";

export const flowConfig: ReactFlowConfig = {
  flowProps: {
    nodes: [
      {
        id: "1",
        data: { label: "Node 1", sampleName: "oscilloscope" },
        position: { x: 250, y: 5 },
        type: "Oscilloscope",
      },
      {
        id: "2",
        data: { label: "Node 1", sampleName: "oscilloscope" },
        position: { x: 400, y: 250 },
        type: "Oscilloscope",
      },
      {
        id: "3",
        data: { label: "Node 1", sampleName: "oscilloscope" },
        position: { x: 600, y: 250 },
        type: "Oscilloscope",
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: "ButtonEdge",
      },
    ],
    nodeTypes: {
      Oscilloscope,
    },
    edgeTypes: {
      ButtonEdge,
    },
    fitView: true,
  },
  backgroundProps: {},
};

// This boilerplate is sadly necessary
export default () => <ReactFlow flowConfig={flowConfig} />;

// This boilerplate is not necessary but Astro is weird
// (no functions allowed in props...)
export function MultiverseFlow() {
  return <Multiverse flowConfig={flowConfig} />;
}
