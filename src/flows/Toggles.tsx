export default function Toggles({ inspecting, setInspecting }) {
  return (
    <div style={{ right: 0, position: "absolute", padding: 25, zIndex: 5 }}>
      <button
        onClick={() => {
          setInspecting(!inspecting);
        }}
      >
        Toggle Inspector
      </button>
    </div>
  );
}
