import { DndProvider } from "react-dnd";
import { SchedulerContainer } from "./SchedulerContainer";
import { SchedulerDragLayer } from "./SchedulerDragLayer";
import { HTML5Backend } from "react-dnd-html5-backend";
import './Scheduler.css';
import { WeekHeader } from "./WeekHeader";
import { useEffect, useRef, useState } from "react";
import { HourSidebar } from './HourSidebar';
import { SchedulerToolbar } from "./SchedulerToolbar";
import { HALF_HOUR_GRID_HEIGHT } from "./constants";

type SchedulerProps = {
    activities : SchedulerActivityMap,
    currentWeek : Date | undefined,
    openActivity: (id: string) => void,
    moveActivity: (id: string, left: number, top: number) => void,
    changeWeek : (offset : number) => void
}

export function Scheduler({activities, currentWeek, openActivity, moveActivity, changeWeek}: SchedulerProps) {
    const [canDrag, setCanDrag] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    const [dragLayerBounds, setDragLayerBounds] = useState<DOMRect | null>(null);
    const schedulerRef = useRef<HTMLDivElement>(null);
    const schedulerScrollRef = useRef<HTMLDivElement>(null);

    // Custom DragLayer goes haywire when position: absolute. To workaround this, we use
    // fixed position and relay the bounds from the parent.
    useEffect(() => {
        if(schedulerRef.current) {
            setDragLayerBounds(schedulerRef.current.getBoundingClientRect());
        }
    }, [schedulerRef]);

    useEffect(() => {
        const activityList = Object.values(activities)
        if(schedulerScrollRef.current && activityList.length > 0) {
            const maxScrollTop = 840 // The scheduler scroll window shows 10 hours, so 2 p.m. is the maximum top
            const scrollTop = activityList.reduce((currentMin : number, activity : DraggableActivityData) => {
                    return Math.min(currentMin, activity.top)
            }, maxScrollTop);

            // Add an 1 hour top margin to the first row of activities
            schedulerScrollRef.current.scrollTop = Math.max(0, scrollTop - 2 * HALF_HOUR_GRID_HEIGHT);
        }
    }, [currentWeek])

    return (
        <>
            <SchedulerToolbar setCanDelete={setCanDelete} setCanDrag={setCanDrag} changWeek={changeWeek} />
            <div className="scheduler-grid-container">
                <WeekHeader startDate={currentWeek} />
                <div className="scheduler-grid" ref={schedulerScrollRef}>
                    <HourSidebar />
                    <DndProvider backend={HTML5Backend}>
                        <div className="scheduler-grid-background" ref={schedulerRef}>
                            <SchedulerContainer activities={activities} openActivity={openActivity} moveActivity={moveActivity} canDrag={canDrag} />
                            <SchedulerDragLayer dragLayerBounds={dragLayerBounds}/>
                        </div>
                    </DndProvider>          
                </div>
            </div>
        </>
    )
}