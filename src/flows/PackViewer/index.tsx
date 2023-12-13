import Flow from "./flow";
import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { navigate } from "astro:transitions/client";

export function createPackViewer(flowConfig: ReactFlowConfig) {
  return ({ initialLocation }: { initialLocation: string }) => {
    return (
      <PackViewer flowConfig={flowConfig} initialLocation={initialLocation} />
    );
  };
}

function PackViewer({
  initialLocation,
  flowConfig,
}: {
  initialLocation: string;
  flowConfig: ReactFlowConfig;
}) {
  const [focus, setFocus] = useState<{ node?: string; edge?: string }>({});
  const [skipAnimation, setSkipAnimation] = useState(
    initialLocation !== "home",
  );

  function navigateToSample(sample: string) {
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

  function popState(event: PopStateEvent) {
    if (event.state?.location === "home") {
      setSkipAnimation(false);
      setFocus({});
    } else {
      navigateToSample(event.state?.location);
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
    // This is needed for viewtransforms to be triggered
    navigate(`${window.location}/${type.toLowerCase()}`, {
      history: "push",
      state: { location: type.toLowerCase() },
    });
    setFocus({
      node: kind === "node" ? id : undefined,
      edge: kind === "edge" ? id : undefined,
    });
    // }
  }

  return (
    <>
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
          focusedFlowSize={{
            /* TODO: This should not be hardcoded but responsive */
            width: 600,
            height: 480,
          }}
          skipAnimation={skipAnimation}
        />
      </ReactFlowProvider>
    </>
  );
}

export default PackViewer;
