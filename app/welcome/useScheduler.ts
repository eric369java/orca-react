import update from 'immutability-helper'
import { useCallback, useEffect, useRef, useState } from "react"
import { dateToGridXY, dateRangeToGridHeight, deserializeDate } from "./utilities"

export default function useScheduler(connectionUrl : string) {
    const [currentWeek, setCurrentWeek] = useState<Date>();
    const [activities, setActivities] = useState<SchedulerActivityMap>({}); // TODO: allow empty activities
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {        
        const ws = new WebSocket(connectionUrl)
        ws.onmessage = (e) => {updateActivities(e)}

        socketRef.current = ws

        return () => {
            ws.close()
        }
    }, [])

    const updateActivities = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        console.log(data)

        // TODO: Handle error status
        if (data.status != 200) {
            return
        }

        if (data.current_week) {
            setCurrentWeek(deserializeDate(data.current_week + 'Z'))
        }

        // TODO: Check for individual activities & none
        if (Array.isArray(data.payload)) {
            const schedulerActivityMap = data.payload.reduce((map : any, activity : any) => {
                const start = deserializeDate(activity.start + 'Z')
                const end = deserializeDate(activity.end + 'Z')
                const [left, top] = dateToGridXY(start)
                const height = dateRangeToGridHeight(start, end)
                
                const draggableActivityData : DraggableActivityData = {
                    id : activity.id,
                    title : activity.title,
                    left : left,
                    top : top, 
                    height : height,
                    type : activity.type,
                    cost : activity.cost,
                    location : activity.location,
                    localTimezone : activity.local_timezone,
                    destLocation : activity.dest_location
                }

                map[activity.id] = draggableActivityData
                return map
            }, {});

            setActivities(schedulerActivityMap)
        }
    }

    const moveActivity = useCallback(
        (id: string, left: number, top: number) => {
            setActivities(
                update(activities, {
                    [id]: {
                        $merge: { left, top },
                    },
                }),
            );

            // TODO : send to backend
        },
        [activities]
    );

    const sendScheduleMessage = (scheduleMesage : ClientScheduleMessage) => {
        socketRef.current?.send(JSON.stringify(scheduleMesage))
    }
    
    return [activities, currentWeek, moveActivity, sendScheduleMessage] as const
}