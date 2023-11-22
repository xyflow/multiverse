import { Handle, Position } from "reactflow";

export default function Oscilloscope() {
  return (
    <div style={{ background: "#CCC", padding: 25 }}>
      THIS IS A TEST
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
