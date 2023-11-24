import { type NodeProps } from "reactflow";

import css from "./multiverse.module.css";

type wrapNode = (
  Component: React.ComponentType<NodeProps>
) => React.ComponentType<NodeProps>;

const wrapNode: wrapNode = (Component) => (props) => {
  // Not really sure about the double div wrapper to prevent user interaction 💩
  return (
    <div
      className={css.nodeHover}
      onClick={() => {
        // FIXME: This routing is just temporary (switch to next router later)
        history.pushState(
          {},
          "",
          `${window.location}/${props.type.toLowerCase()}`
        );
      }}
    >
      <div style={{ pointerEvents: "all" }}>
        <Component {...props} />
      </div>
    </div>
  );
};

export default wrapNode;
