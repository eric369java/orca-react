import { DndProvider } from "react-dnd";
import SchedulerContainer from "./SchedulerContainer";
import SchedulerDragLayer from "./SchedulerDragLayer";
import { HTML5Backend } from "react-dnd-html5-backend";
import './Scheduler.css';
import { WeekHeader } from "./WeekHeader";
import { useEffect, useRef, useState } from "react";
import HourSidebar from './HourSidebar';
import SchedulerToolbar from "./SchedulerToolbar";

type SchedulerProps = {
    activities : SchedulerActivityMap,
    currentWeek : Date | undefined,
    openActivity: (id: string) => void,
    moveActivity: (id: string, left: number, top: number) => void,
    shiftCurrentWeek : (numWeeks : number) => void
}

export default function Scheduler({activities, currentWeek, openActivity, moveActivity, shiftCurrentWeek}: SchedulerProps) {
    const [canDrag, setCanDrag] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    const [dragLayerBounds, setDragLayerBounds] = useState<DOMRect | null>(null);
    const schedulerRef = useRef<HTMLDivElement>(null);
    
    // Custom DragLayer goes haywire when position: absolute. To workaround this, we use
    // fixed position and relay the bounds from the parent.
    useEffect(() => {
        if(schedulerRef.current) {
            setDragLayerBounds(schedulerRef.current.getBoundingClientRect());
        }
    }, [schedulerRef]);

    return (
        <div>
            <SchedulerToolbar setCanDelete={setCanDelete} setCanDrag={setCanDrag} shiftCurrentWeek={shiftCurrentWeek} />
            <div className="scheduler-grid-container">
                <WeekHeader startDate={currentWeek} />
                <div className="scheduler-grid">
                    <HourSidebar />
                    <DndProvider backend={HTML5Backend}>
                        <div className="scheduler-grid-background" ref={schedulerRef}>
                            <SchedulerContainer activities={activities} openActivity={openActivity} moveActivity={moveActivity} canDrag={canDrag} />
                            <SchedulerDragLayer dragLayerBounds={dragLayerBounds}/>
                        </div>
                    </DndProvider>          
                </div>
            </div>
        </div>
    )
}