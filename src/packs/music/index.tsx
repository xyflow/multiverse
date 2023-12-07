import ReactDevFlow from "../../flows/ReactDevFlow";
import { createPackViewer } from "../../flows/PackViewer";

import Adsr from "./adsr/Adsr.tsx";
import Amp from "./amp/Amp.tsx";
import Osc from "./osc/Osc.tsx";
import Xy from "./xy/Xy.tsx";

import AudioEdge from "./audioedge/AudioEdge.tsx";
import { parseFilesToSamples } from "../../utils/paths.ts";
import type { GetStaticPaths } from "astro";

export const flowConfig: ReactFlowConfig = {
  flowProps: {
    nodes: [
      {
        id: "1",
        data: {
          frequency: 220,
          waveform: "triangle",
        },
        position: { x: 0, y: 0 },
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
      {
        id: "1->2",
        source: "1",
        target: "2",
        targetHandle: "in",
        type: "AudioEdge",
        data: {
          title: "AudioEdge",
        },
      },
      {
        id: "2->4",
        source: "2",
        target: "4",
        targetHandle: "in",
        type: "AudioEdge",
        data: {
          title: "AudioEdge",
        },
      },
      {
        id: "3->4",
        source: "3",
        target: "4",
        type: "AudioEdge",
        data: {
          title: "AudioEdge",
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
      AudioEdge,
    },
    defaultEdgeOptions: {
      type: "AudioEdge",
    },
    fitView: true,
  },
  backgroundProps: {},
};

// This exports a minimal flow for development
export const DevFlow = () => <ReactDevFlow flowConfig={flowConfig} />;

// This exports the pack viewer for production
export default createPackViewer(flowConfig);

const files = import.meta.glob(
  // And here ------- 👇
  ["../../../../packs/music/**/**/*", "!**/index.tsx", "!**/*.css"],
  { eager: true, as: "raw" },
);

const modules = import.meta.glob(
  // And here ------- 👇
  ["../../../../packs/music/**/**/*.tsx", "!**/index.tsx"],
  { eager: true, import: "default", query: "?inline" },
);

const samples = parseFilesToSamples(files, modules);
export const routes: ReturnType<GetStaticPaths> = [];
Object.keys(samples).forEach((sample) => {
  routes.push({
    params: {
      sample,
    },
    props: {
      samples,
    },
  });
});

routes.push({
  params: {
    sample: undefined,
  },
  props: {
    samples,
  },
});
