import { useEffect, type CSSProperties } from 'react'
import { useDrag, type DragSourceMonitor } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { SchedulerActivity } from './SchedulerActivity'

function getStyles(
    left: number,
    top: number,
    isDragging: boolean,
): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

type DraggableActivityProps = DraggableActivityData & {
    canDrag: boolean,
    openActivity: (id : string) => void
}

export function DraggableActivity({id, title, left, top, height, canDrag, openActivity} : DraggableActivityProps) {
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            canDrag: canDrag,
            type: 'activity',
            item: { id, title, left, top, height },
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging(),
              }),
        }),
        [id, title, left, top, height, canDrag]
    );

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, []);

    return drag(
        <div style={getStyles(left, top, isDragging)} role='draggable activity'>
            <SchedulerActivity id={id} title={title} height={height} openActivity={openActivity}/>
        </div>
    );
}