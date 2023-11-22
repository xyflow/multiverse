import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  Controls,
  Panel,
  MiniMap,
  Background,
  type NodeProps,
  type EdgeProps,
} from "reactflow";

import "reactflow/dist/style.css";

import css from "./multiverse.module.css";
import Toggles from "./Toggles";

type FlowProps = {
  flowConfig: ReactFlowConfig;
  clean?: Boolean;
};

type wrapNode = (
  Component: React.ComponentType<NodeProps>
) => React.ComponentType<NodeProps>;

const wrapNode: wrapNode = (Component) => (props) => {
  // Not really sure about the double div wrapper 💩
  return (
    <div className={css.nodeHover}>
      <div style={{ pointerEvents: "none" }}>
        <Component {...props} />
      </div>
    </div>
  );
};

type wrapEdge = (
  Component: React.ComponentType<EdgeProps>
) => React.ComponentType<EdgeProps>;

const wrapEdge: wrapEdge = (Component) => (props) => {
  // Not really sure about the double div wrapper 💩
  return (
    <>
      <Component {...props} />
    </>
  );
};

export default ({ flowConfig, clean }: FlowProps) => {
  const [nodes, setNodes] = useState(flowConfig.flowProps?.nodes);
  const [edges, setEdges] = useState(flowConfig.flowProps?.edges);

  const [inspecting, setInspecting] = useState(false);

  const wrappedNodeTypes = useMemo(
    () =>
      Object.entries<React.ComponentType<NodeProps>>(
        flowConfig.flowProps?.nodeTypes
      ).reduce(
        (acc: Record<string, React.ComponentType<NodeProps>>, [key, value]) => {
          acc[key] = wrapNode(value);
          return acc;
        },
        {}
      ),
    []
  );

  const wrappedEdgeTypes = useMemo(
    () =>
      Object.entries<React.ComponentType<EdgeProps>>(
        flowConfig.flowProps?.edgeTypes
      ).reduce(
        (acc: Record<string, React.ComponentType<EdgeProps>>, [key, value]) => {
          acc[key] = wrapEdge(value);
          return acc;
        },
        {}
      ),
    []
  );

  const props = { ...flowConfig.flowProps, nodes, edges };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        {...props}
        onNodesChange={inspecting ? () => {} : onNodesChange}
        // panOnDrag={false}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={
          clean || !inspecting
            ? flowConfig.flowProps?.nodeTypes
            : wrappedNodeTypes
        }
        edgeTypes={
          clean || !inspecting
            ? flowConfig.flowProps?.edgeTypes
            : wrappedEdgeTypes
        }
      >
        {flowConfig.controlsProps && <Controls {...flowConfig.controlsProps} />}
        {flowConfig.panelProps && <Panel {...flowConfig.panelProps} />}
        {flowConfig.minimapProps && <MiniMap {...flowConfig.minimapProps} />}
        {flowConfig.backgroundProps && (
          <Background {...flowConfig.backgroundProps} />
        )}
        {!clean && (
          <Toggles inspecting={inspecting} setInspecting={setInspecting} />
        )}
      </ReactFlow>
    </div>
  );
};
