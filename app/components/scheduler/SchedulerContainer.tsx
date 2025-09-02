
import { useDrop } from 'react-dnd'
import { snapToSchedulerGrid, willActivitiesOverlap } from './utilities'
import  { DraggableActivity } from './DraggableActivity'
import './SchedulerContainer.css'
import { HALF_HOUR_GRID_HEIGHT, ONE_DAY_GRID_WIDTH } from './constants'

function canDropActivity(activities: SchedulerActivityMap, newActivity: DraggableActivityData) : boolean {
    for (const [key, value] of Object.entries(activities)) {
        if (newActivity.id !== key && willActivitiesOverlap(value, newActivity)) {
            return false;
        }
    }
    return true;
}

type SchedulerContainerProps = {
    activities: SchedulerActivityMap,
    openActivity: (id : string) => void,
    moveActivity: (id: string, left: number, top: number) => void,
    canDrag: boolean,
}

export function SchedulerContainer({activities, openActivity, moveActivity, canDrag}: SchedulerContainerProps) {    
    const [, drop] = useDrop(
        () => ({
          accept: 'activity',
          drop(item: DraggableActivityData, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset() as {
              x: number
              y: number
            };
    
            let left = Math.round(item.left + delta.x);
            let top = Math.round(item.top + delta.y);
            ;[left, top] = snapToSchedulerGrid(left, top);
            
            // Makes sure the activity isn't allowed to be partially out-of-bounds.
            const maxLeft = ONE_DAY_GRID_WIDTH * 6;
            const maxTop = (HALF_HOUR_GRID_HEIGHT * 48) - item.height;
            left = left < 0 ? 0 : left > maxLeft ? maxLeft : left;
            top = top < 0 ? 0 : top > maxTop ? maxTop : top;

            // Check if new coordinates overlap with existing activities
            const newActivity = {...item, left: left, top: top};
            if (canDropActivity(activities, newActivity)) {
                moveActivity(item.id, left, top);
            }

            return undefined;
          },
        }),
        [moveActivity],
    );

    return drop(
        <div className='scheduler-container'>
            {Object.keys(activities).map((key) => (
                <DraggableActivity
                    key={key}
                    id={key}
                    {...(activities[key] as {
                        scheduleId : string,
                        title: string,
                        left: number,
                        top: number,
                        height: number,
                        type: string,
                        cost: string | undefined, 
                        location: string | undefined,
                        localTimezone: number,
                        destLocation: string | undefined,
                        version : number
                     })}
                    canDrag={canDrag} 
                    openActivity={openActivity}/>
            ))}
        </div>
    )
}