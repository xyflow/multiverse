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

import wrapNode from "./wrapNode";
import wrapEdge from "./wrapEdge";
import Toggles from "./Toggles";

type FlowProps = {
  flowConfig: ReactFlowConfig;
  clean?: Boolean;
};

export default ({ flowConfig }: FlowProps) => {
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
        onEdgesChange={inspecting ? () => {} : onEdgesChange}
        onConnect={onConnect}
        nodeTypes={
          !inspecting ? flowConfig.flowProps?.nodeTypes : wrappedNodeTypes
        }
        edgeTypes={
          !inspecting ? flowConfig.flowProps?.edgeTypes : wrappedEdgeTypes
        }
      >
        {flowConfig.controlsProps && <Controls {...flowConfig.controlsProps} />}
        {flowConfig.panelProps && <Panel {...flowConfig.panelProps} />}
        {flowConfig.minimapProps && <MiniMap {...flowConfig.minimapProps} />}
        {flowConfig.backgroundProps && (
          <Background {...flowConfig.backgroundProps} />
        )}

        <Toggles inspecting={inspecting} setInspecting={setInspecting} />
      </ReactFlow>
    </div>
  );
};
