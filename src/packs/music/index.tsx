import MultiverseFlow from "@flows/MultiverseFlow";

import Oscilloscope from "./oscilloscope/Oscilloscope.tsx";

const flowConfig: ReactFlowConfig = {
  flowProps: {
    nodes: [
      {
        id: "1",
        data: { label: "Node 1" },
        position: { x: 250, y: 5 },
        type: "Oscilloscope",
      },
    ],
    nodeTypes: {
      Oscilloscope,
    },
    fitView: true,
  },
  backgroundProps: {},
};

export default ({ clean = false }: { clean?: Boolean }) => (
  <MultiverseFlow flowConfig={flowConfig} clean={clean} />
);
