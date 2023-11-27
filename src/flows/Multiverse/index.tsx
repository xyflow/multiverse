import type { Sample } from "@utils/paths";
import Flow from "./flow";
import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import css from "./multiverse.module.css";
import { CodeViewer } from "./CodeViewer";

export default function ({
  samples,
  initialLocation,
  flowConfig,
  pack,
}: {
  samples: Record<string, Sample>;
  initialLocation: string;
  flowConfig: ReactFlowConfig;
  pack: string;
}) {
  const [code, setCode] = useState<string>();
  const [focus, setFocus] = useState<{ node?: string; edge?: string }>({});
  const [skipAnimation, setSkipAnimation] = useState(
    initialLocation !== "home",
  );

  function backToHome() {
    setSkipAnimation(false);
    history.pushState({ location: "home" }, "", `/multiverse/${pack}`);
    setCode(undefined);
    setFocus({});
  }

  function popState(event: PopStateEvent) {
    if (event.state?.location === "home") {
      setSkipAnimation(false);
      setCode(undefined);
      setFocus({});
    } else {
      navigateToSample(event.state?.location);
    }
    console.log(event.state);
  }

  function navigateToSample(sample: string) {
    const codeSample = samples[sample];

    if (codeSample) {
      setCode(codeSample.react);

      const possibleNode = flowConfig.flowProps?.nodes.find(
        (node) => node.type.toLowerCase() === sample,
      );

      if (possibleNode) {
        setFocus({
          node: possibleNode.id,
          edge: undefined,
        });
      } else {
        const possibleEdge = flowConfig.flowProps?.edges?.find(
          (edge) => edge.type.toLowerCase() === sample,
        );

        if (possibleEdge) {
          setFocus({
            node: undefined,
            edge: possibleEdge.id,
          });
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener("popstate", popState);

    if (initialLocation === "home") {
      history.replaceState({ location: initialLocation }, "");
    } else {
      navigateToSample(initialLocation);
    }

    return () => {
      window.removeEventListener("popstate", popState);
    };
  }, []);

  function onElementClick(type: string, id: string, kind: string) {
    const codeSample = samples[type.toLowerCase()];
    if (codeSample) {
      // FIXME: This routing is just temporary (switch to next router later)
      history.pushState(
        { pack: "music", location: type.toLowerCase() },
        "",
        `${window.location}/${type.toLowerCase()}`,
      );
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
              <div
                className="h-96"
                onClick={() => {
                  backToHome();
                }}
              />
              <div
                className={`${
                  skipAnimation ? "" : "animate-fade-in-delayed"
                } grow bg-white p-5 transition-opacity`}
              >
                <h1 className="font-xl text-small text-center">Oscilliscope</h1>
                <p>
                  There might be a description here, explaining how to use the
                  node or whatever.
                </p>
              </div>
            </div>
            <div
              className={`w-100 
              ${skipAnimation ? "" : "animate-fade-in-delayed"} 
              grow bg-white transition-opacity`}
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
