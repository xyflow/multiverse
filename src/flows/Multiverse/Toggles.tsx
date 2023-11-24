export default function Toggles({ inspecting, setInspecting }) {
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
