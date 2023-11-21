import Oscilloscope from "./oscilloscope/Oscilloscope";

export default {
  flowProps: {
    nodes: [{ id: "1", data: { label: "Node 1" }, position: { x: 250, y: 5 } }],
    nodeTypes: {
      Oscilloscope,
    },
    fitView: true,
  },
  backgroundProps: {},
} satisfies ReactFlowConfig;
