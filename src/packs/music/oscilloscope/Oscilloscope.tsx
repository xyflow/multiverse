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

// PRUNE START
export const meta = {
  title: "Oscilloscope",
  description:
    "A simple oscilloscope that plots the amplitude of an audio signal as a function of time.",
};
// PRUNE END
