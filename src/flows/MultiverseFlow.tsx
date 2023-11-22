import { useState, useCallback } from "react";
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
} from "reactflow";

import "reactflow/dist/style.css";

type FlowProps = {
  flowConfig: ReactFlowConfig;
  clean?: Boolean;
};

function wrapNode(component) {
  return (props) => <component {...props} />;
}

function wrapEdge(component) {
  return (props) => <component {...props} />;
}

export default ({ flowConfig, clean }: FlowProps) => {
  // console.log(flowConfig);
  const wrappedNodes = flowConfig.flowProps?.nodes?.map(wrapNode);
  const [nodes, setNodes] = useState(flowConfig.flowProps?.nodes);
  const [edges, setEdges] = useState(flowConfig.flowProps?.edges);

  console.log(clean);

  // const nodeTypes = {};
  // Object.entries(flowConfig.flowProps?.nodeTypes).forEach(([key, value]) => {
  //   nodeTypes[key] = wrapNode(value);
  // });

  console.log(flowConfig.flowProps);

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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        {flowConfig.controlsProps && <Controls {...flowConfig.controlsProps} />}
        {flowConfig.panelProps && <Panel {...flowConfig.panelProps} />}
        {flowConfig.minimapProps && <MiniMap {...flowConfig.minimapProps} />}
        {flowConfig.backgroundProps && (
          <Background {...flowConfig.backgroundProps} />
        )}
      </ReactFlow>
    </div>
  );
};
