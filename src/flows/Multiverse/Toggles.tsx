import type { Dispatch, SetStateAction } from "react";

type ToggleProps = {
  inspecting: Boolean;
  setInspecting: Dispatch<SetStateAction<boolean>>;
};

export default function Toggles({ inspecting, setInspecting }: ToggleProps) {
  return (
    <div className={"z-5 absolute right-0 p-10"}>
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
