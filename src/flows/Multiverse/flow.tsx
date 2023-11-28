import { useState, useCallback, useMemo, useEffect } from "react";
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
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

import wrapNode from "./wrapNode";
import wrapEdge from "./wrapEdge";
import Toggles from "./Toggles";

const DURATION = 350;
const FOCUS_PADDING = 50;

function calculateZoom(
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number,
  padding: number,
) {
  const widthZoom = containerWidth / (width + padding);
  const heightZoom = containerHeight / (height + padding);
  return Math.min(widthZoom, heightZoom);
}

type FlowProps = {
  flowConfig: ReactFlowConfig;
  onNodeClick: (nodeType: string, nodeId: string) => void;
  onEdgeClick: (edgeType: string, edgeId: string) => void;
  focus: { node?: string; edge?: string };
  focusedFlowSize: { width: number; height: number };
  skipAnimation: boolean;
};

export default ({
  flowConfig,
  onNodeClick,
  onEdgeClick,
  focus,
  focusedFlowSize,
  skipAnimation,
}: FlowProps) => {
  const [nodes, setNodes] = useState(flowConfig.flowProps?.nodes!);
  const [edges, setEdges] = useState(flowConfig.flowProps?.edges!);
  const [inspecting, setInspecting] = useState(true);

  const viewport = useReactFlow();

  useEffect(() => {
    if (focus.node) {
    }
  }, []);

  useEffect(() => {
    if (focus.node && focus.edge) {
      // Don't support focusing multiple nodes & edges
      return;
    }

    if (!focus.node && !focus.edge) {
      viewport.fitView({ nodes, duration: DURATION });
      return;
    }

    // TODO: If animation should be skipped, this should be the initial viewport?
    // Maybe not possible, but then it still should not be visible for a second first
    if (focus.node) {
      // viewport.fitView({ nodes: [{ id: focus.node }], duration: 150 });
      const node = nodes?.find((n) => n.id === focus.node);
      const zoom = calculateZoom(
        node.width,
        node.height,
        focusedFlowSize.width,
        focusedFlowSize.height,
        FOCUS_PADDING,
      );

      viewport.setViewport(
        {
          x: -node.position.x * zoom + focusedFlowSize.width * 0.5,
          y: -node.position.y * zoom + focusedFlowSize.height * 0.5,
          zoom: zoom,
        },
        { duration: skipAnimation ? 0 : 350 },
      );
      return;
    }

    if (focus.edge) {
      // TODO: Focus on edge
      return;
    }
  }, [focus]);

  const wrappedNodeTypes = useMemo(
    () =>
      Object.entries<React.ComponentType<NodeProps>>(
        flowConfig.flowProps?.nodeTypes,
      ).reduce(
        (acc: Record<string, React.ComponentType<NodeProps>>, [key, value]) => {
          acc[key] = wrapNode(value, onNodeClick);
          return acc;
        },
        {},
      ),
    [],
  );

  const wrappedEdgeTypes = useMemo(
    () =>
      Object.entries<React.ComponentType<EdgeProps>>(
        flowConfig.flowProps?.edgeTypes,
      ).reduce(
        (acc: Record<string, React.ComponentType<EdgeProps>>, [key, value]) => {
          acc[key] = wrapEdge(value, onEdgeClick);
          return acc;
        },
        {},
      ),
    [],
  );

  const props = { ...flowConfig.flowProps, nodes, edges };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds!)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds!)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds!)),
    [],
  );

  return (
    <ReactFlow
      {...props}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      // panOnDrag={false}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={
        !inspecting ? flowConfig.flowProps?.nodeTypes : wrappedNodeTypes
      }
      edgeTypes={
        !inspecting ? flowConfig.flowProps?.edgeTypes : wrappedEdgeTypes
      }
      nodeOrigin={[0.5, 0.5]}
    >
      {flowConfig.controlsProps && <Controls {...flowConfig.controlsProps} />}
      {flowConfig.panelProps && <Panel {...flowConfig.panelProps} />}
      {flowConfig.minimapProps && <MiniMap {...flowConfig.minimapProps} />}
      {flowConfig.backgroundProps && (
        <Background {...flowConfig.backgroundProps} />
      )}

      <Toggles inspecting={inspecting} setInspecting={setInspecting} />
    </ReactFlow>
  );
};
