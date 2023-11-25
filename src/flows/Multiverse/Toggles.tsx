import type { Dispatch, SetStateAction } from "react";

type ToggleProps = {
  inspecting: Boolean;
  setInspecting: Dispatch<SetStateAction<boolean>>;
};

export default function Toggles({ inspecting, setInspecting }: ToggleProps) {
  return (
    <div
      style={{ right: 0, position: "absolute", padding: 25, zIndex: 5 }}
      className={"toggles"}
    >
      <button
        onClick={() => {
          setInspecting(!inspecting);
        }}
      >
        Inspector {inspecting ? "OFF" : "ON"}
      </button>
    </div>
  );
}
