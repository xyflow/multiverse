import { useEffect, useRef, useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  useReactFlow,
  type EdgeProps,
  type ReactFlowInstance,
  EdgeLabelRenderer,
} from "reactflow";

import css from "./multiverse.module.css";

const PADDING = 10;

type wrapEdge = (
  Component: React.ComponentType<EdgeProps>
) => React.ComponentType<EdgeProps>;

function getPathBB(path: SVGElement, reactFlowInstance: ReactFlowInstance) {
  const pathBBox = path.getBoundingClientRect();

  const zoom = reactFlowInstance.getZoom();

  const flowPosition = reactFlowInstance.screenToFlowPosition({
    x: pathBBox.x,
    y: pathBBox.y,
  });

  return {
    width: pathBBox.width / zoom,
    height: pathBBox.height / zoom,
    x: flowPosition.x,
    y: flowPosition.y,
  };
}

const wrapEdge: wrapEdge = (Component) => (props) => {
  const reactFlowInstance = useReactFlow();

  const group = useRef<SVGGElement>(null);

  const [hover, setHover] = useState(false);
  const [pathBB, setPathBB] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (group.current) {
      const path = group.current.firstChild as SVGElement;

      // set initial path bounding box
      const newPathBBox = getPathBB(path, reactFlowInstance);
      setPathBB(newPathBBox);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          // set new path bounding box when 'd' changes
          if (mutation.attributeName === "d") {
            const newPathBBox = getPathBB(path, reactFlowInstance);
            setPathBB(newPathBBox);
          }
        });
      });

      observer.observe(path, { attributes: true });
    }
  }, []);

  return (
    <g
      className={css.pathGroup}
      ref={group}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <Component {...props} />
      <HoverCard.Root open={hover}>
        <EdgeLabelRenderer>
          <HoverCard.Content side="top" sideOffset={5} style={{ zIndex: 10 }}>
            <div className={css.tooltip}>
              <span className={css.tooltipTitle}>Edge Type Missing</span>
            </div>
            <HoverCard.Arrow className={css.arrow} />
          </HoverCard.Content>
        </EdgeLabelRenderer>
        <EdgeLabelRenderer>
          <HoverCard.Trigger asChild>
            <div
              onClick={() => {
                // FIXME: This routing is just temporary (switch to next router later)
                history.pushState({}, "", `${window.location}/edgetypemissing`);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              className={css.edgeHighlightBox}
              style={{
                visibility: hover ? "visible" : "hidden",
                width: pathBB.width + PADDING * 2,
                height: pathBB.height + PADDING * 2,
                transform: `translate(${pathBB.x - PADDING}px, ${
                  pathBB.y - PADDING
                }px)`,
              }}
            />
          </HoverCard.Trigger>
        </EdgeLabelRenderer>
      </HoverCard.Root>
    </g>
  );
};

export default wrapEdge;