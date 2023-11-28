import ReactFlow from "@flows/ReactFlow.tsx";
import Multiverse from "@flows/Multiverse";

import Oscilloscope from "./oscilloscope/Oscilloscope.tsx";
import ButtonEdge from "./buttonedge/ButtonEdge.tsx";
import type { Sample } from "@utils/paths.ts";

export const flowConfig: ReactFlowConfig = {
  flowProps: {
    nodes: [
      {
        id: "1",
        data: {
          label: "Node 1",
          description:
            "With this node you can display the amplitudes of your signal as a function of time.",
        },
        position: { x: 250, y: 0 },
        type: "Oscilloscope",
      },
      {
        id: "2",
        data: {
          label: "Node 1",
          description:
            "With this node you can display the amplitudes of your signal as a function of time.",
        },
        position: { x: 400, y: 250 },
        type: "Oscilloscope",
      },
      {
        id: "3",
        data: {
          label: "Node 1",
          description:
            "With this node you can display the amplitudes of your signal as a function of time.",
        },
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
        data: {
          title: "ButtonEdge",
          description: "An edge with a button, what do you think it does?",
        },
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
