import update from 'immutability-helper'
import SchedulerRequestManager from './schedulerRequestManager'
import { useEffect, useRef, useState } from "react"
import { getActivity, serializeDate } from "./utilities"

export default function useScheduler(connectionUrl : string, scheduleId: string, clientId : string) {
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
    const [activities, setActivities] = useState<SchedulerActivityMap>({});

    const connectionRef = useRef<SchedulerRequestManager>(new SchedulerRequestManager());

    useEffect(() => {        
        connectionRef.current.updateCurrentWeek = updateCurrentWeek
        connectionRef.current.updateActivity = updateActivity
        connectionRef.current.updateSchedule = updateSchedule
        connectionRef.current.connect(connectionUrl)

        return () => {
            connectionRef.current.disconnect()
        }
    }, [])

    const updateCurrentWeek = (newStartDate : Date) => {
        setCurrentWeek(newStartDate)
    }

    const updateActivity = (id: string, newActivity : DraggableActivityData | null) => {
        if (newActivity) {
            setActivities(activities => {
               return { ...activities, [id] : newActivity }
            })
        }
        else {
            setActivities(activities => {
                const {[id] : _, ...otherActivities} = activities
                return otherActivities
            })
        }
    }

    const updateSchedule = (newActivities : SchedulerActivityMap) => {
        setActivities(newActivities)
    } 

    const moveActivity = (id: string, left: number, top: number) => {
        const version = activities[id].version + 1
        const updatedSchedule = update(activities, {
            [id]: {
                $merge: { left, top, version },
            },
        })

        setActivities(updatedSchedule);

        const updatedActivity = getActivity(updatedSchedule[id], currentWeek)
        const request : ActivityRequest = {
            id : generateRequestId(),
            client_id : clientId,
            action : "PATCH",
            target_week : serializeDate(currentWeek),
            activity_id : id,
            description : null,
            activity : updatedActivity
        }

        connectionRef.current.sendActivityRequest(request)
    }

    const changeWeek = (offset : number) => {
        if (!currentWeek || !Number.isInteger(offset)) {
            return;
        }

        const targetWeek = new Date(currentWeek);
        targetWeek.setUTCDate(currentWeek.getUTCDate() + offset * 7);
        const request : ActivityRequest = {
            id : generateRequestId(),
            client_id  : clientId,
            action : "GETWEEK",
            target_week : serializeDate(targetWeek),
            activity_id : null,
            description : null, 
            activity : null
        }

        connectionRef.current.sendActivityRequest(request)
    }

    const generateRequestId = () => {
        // Ids only have to be unique within one user session. We can reasonably assume
        // this generated id is unique in that context.
        return Date.now().toString(16) + Math.floor(Math.random() * 100);
    }

    return [activities, currentWeek, moveActivity, changeWeek] as const
}