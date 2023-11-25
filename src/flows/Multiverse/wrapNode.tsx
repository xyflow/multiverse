import { EdgeLabelRenderer, type NodeProps } from "reactflow";
import * as HoverCard from "@radix-ui/react-hover-card";

import css from "./multiverse.module.css";

type wrapNode = (
  Component: React.ComponentType<NodeProps>
) => React.ComponentType<NodeProps>;

const wrapNode: wrapNode = (Component) => (props) => {
  // FIXME: Not really sure about the double div wrapper to prevent user interaction 💩
  return (
    <HoverCard.Root openDelay={0} closeDelay={0}>
      <EdgeLabelRenderer>
        <HoverCard.Content side="top" sideOffset={20}>
          <div className={css.tooltip}>
            <span className={css.tooltipTitle}>{props.type}</span>
          </div>
          <HoverCard.Arrow className={css.arrow} />
        </HoverCard.Content>
      </EdgeLabelRenderer>
      <HoverCard.Trigger asChild>
        <div
          className={css.nodeHighlightBox}
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
      </HoverCard.Trigger>
    </HoverCard.Root>
  );
};

export default wrapNode;
