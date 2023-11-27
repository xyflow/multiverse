import type { Sample } from "@utils/paths";
import Flow from "./flow";
import { useState } from "react";
import { ReactFlowProvider } from "reactflow";

import css from "./multiverse.module.css";
import { CodeViewer } from "./CodeViewer";

export default function ({
  samples,
  flowConfig,
}: {
  samples: Record<string, Sample>;
  flowConfig: ReactFlowConfig;
}) {
  const [code, setCode] = useState<string>();
  const [focus, setFocus] = useState<{ node?: string; edge?: string }>({});

  function onElementClick(type: string, id: string, kind: string) {
    const codeSample = samples[type.toLowerCase()];

    if (codeSample) {
      // FIXME: This routing is just temporary (switch to next router later)
      history.pushState({}, "", `${window.location}/${type.toLowerCase()}`);
      setCode(codeSample.react);
      setFocus({
        node: kind === "node" ? id : undefined,
        edge: kind === "edge" ? id : undefined,
      });
    }
  }

  return (
    <>
      <div className="relative mx-auto box-border h-full w-full max-w-[78rem]">
        <ReactFlowProvider>
          <Flow
            flowConfig={flowConfig}
            onNodeClick={(nodeType: string, nodeId: string) => {
              onElementClick(nodeType, nodeId, "node");
            }}
            onEdgeClick={(edgeType: string, edgeId: string) => {
              onElementClick(edgeType, edgeId, "edge");
            }}
            focus={focus}
          />
        </ReactFlowProvider>
        {code && (
          <div className="absolute top-0 box-border flex h-full w-full">
            <div className="flex h-full w-96 flex-col">
              {/* window for react flow */}
              <div className="h-96" />
              <div
                className={`grow bg-white p-5 transition-opacity ${css.fadeIn}`}
              >
                <h1 className="text-center text-xl font-medium">
                  Oscilliscope
                </h1>
                <p>
                  There might be a description here, explaining how to use the
                  node or whatever.
                </p>
              </div>
            </div>
            <div
              className={`w-100 grow bg-white transition-opacity ${css.fadeIn}`}
            >
              <div className="m-auto max-w-2xl p-10">
                <p>Copy this into your project</p>
                <CodeViewer files={{ "App.js": code }} readOnly />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
