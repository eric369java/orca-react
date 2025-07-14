import { useDragLayer, type XYCoord } from "react-dnd";
import { snapToSchedulerGrid } from "./utilities";
import { type CSSProperties } from "react";
import { HALF_HOUR_GRID_HEIGHT, ONE_DAY_GRID_WIDTH } from "./constants";
import SchedulerActivity from "./SchedulerActivity";

function getLayerStyles(dragLayerBounds: DOMRect | null): CSSProperties {
  return {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: dragLayerBounds ? `${dragLayerBounds.left}px`: '0',
    top: dragLayerBounds ? `${dragLayerBounds.top}px`: '0',
    width: dragLayerBounds ? `${dragLayerBounds.width}px`: '100%',
    height: dragLayerBounds ? `${dragLayerBounds.height}px` : '100%',
  }
}

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    dragLayerBounds: DOMRect | null,
    activityHeight: number
  ) 
{
    if (!initialOffset || !currentOffset) {
      return {}
    }

    let { x, y } = currentOffset;

    // Calculate the new snapped absolute position
    x -= initialOffset.x;
    y -= initialOffset.y;
    ;[x, y] = snapToSchedulerGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
    
    // Calculate the translation relative to the parent scheduler's bounds
    if (dragLayerBounds) {
      x -= dragLayerBounds.left;
      y -= dragLayerBounds.top;
    }

    let maxXOffset = ONE_DAY_GRID_WIDTH * 6 - window.scrollX;
    let maxYOffset = (HALF_HOUR_GRID_HEIGHT * 48) - activityHeight - window.scrollY;
    let minXOffset = -1 * window.scrollX;
    let minYOffset = -1 * window.scrollY;
    x = x < minXOffset ? minXOffset : x > maxXOffset ? maxXOffset : x;
    y = y < minYOffset ? minYOffset : y > maxYOffset ? maxYOffset : y;

    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform
    };
}

type SchedulerDragLayerProps = {
  dragLayerBounds: DOMRect | null
}

export default function SchedulerDragLayer({dragLayerBounds}: SchedulerDragLayerProps) {
    const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

    if (!isDragging) {
        return null
    }

    return (
      <div style={getLayerStyles(dragLayerBounds)}>
        <div style={getItemStyles(initialOffset, currentOffset, dragLayerBounds, item.height)}>
          <SchedulerActivity id={item.id} title={item.title} height={item.height} />
        </div>
      </div>
    );
}