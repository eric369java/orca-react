import update from 'immutability-helper'
import { RequestActions } from './constants'
import SchedulerRequestFactory from './schedulerRequestFactory'
import SchedulerRequestManager from './schedulerRequestManager'
import { useEffect, useRef, useState } from "react"
import { deserializeDate, getActivity, getActivityForm, getDraggableActivityData, getSchedulerActivityMap } from "./utilities"

export default function useScheduler(connectionUrl : string, scheduleId: string, clientId : string) {
    const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
    const [activities, setActivities] = useState<SchedulerActivityMap>({});

    // States have their latest values when read from within a React context. But in the context of event handlers
    // attached to SchedulerRequestManager, the states always return their value when they were attached. 
    // useRef here for the event handlers to get the latest state.
    const currentWeekRef = useRef<Date>(new Date());
    const activitiesRef = useRef<SchedulerActivityMap>({});

    const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
    const [activityFormInitValue, setActivityFormInitValue] = useState<ActivityForm | undefined>(undefined);

    const connectionRef = useRef<SchedulerRequestManager>(new SchedulerRequestManager());

    useEffect(() => {
        currentWeekRef.current = currentWeek;
    }, [currentWeek])

    useEffect(() => {
        activitiesRef.current = activities;
    }, [activities])

    useEffect(() => {        
        connectionRef.current.onResponse = onResponse;
        connectionRef.current.onDescriptionLoaded = onDescriptionLoaded;
        connectionRef.current.connect(connectionUrl)

        return () => {
            connectionRef.current.disconnect()
        }
    }, [])

    const moveActivity = (id: string, left: number, top: number) => {
        const version = activities[id].version + 1
        const updatedSchedule = update(activities, {
            [id]: {
                $merge: { left, top, version },
            },
        })

        setActivities(updatedSchedule);

        const updatedActivity = getActivity(updatedSchedule[id], currentWeek)
        const request = SchedulerRequestFactory.createPatchRequest(id, updatedActivity, clientId, currentWeek)
        connectionRef.current.sendActivityRequest(request)
    }

    const changeWeek = (offset : number) => {
        if (!currentWeek || !Number.isInteger(offset)) {
            return;
        }

        const targetWeek = new Date(currentWeek);
        targetWeek.setUTCDate(currentWeek.getUTCDate() + offset * 7);
        const request : ActivityRequest = SchedulerRequestFactory.createGetWeekRequest(clientId, targetWeek)

        connectionRef.current.sendActivityRequest(request)
    }

    const loadActivityForm = (id : string) => {
        setIsLoadingForm(true)

        const request : ActivityRequest = SchedulerRequestFactory.createGetRequest(id, clientId, currentWeek)
        connectionRef.current.sendActivityRequest(request);
    }

    const onDescriptionLoaded = (data : any) : void => {
        if (!data.activity_id) {
            return
        }
        
        const activity = getActivity(activitiesRef.current[data.activity_id], currentWeekRef.current)
        const form = getActivityForm(activity, data.description ?? '')

        setActivityFormInitValue(form);
        setIsLoadingForm(false);
    }

    const onResponse = (data : any, isSelfSent : boolean) : void => {
        if (data.target_week) {
            const newStartDate = deserializeDate(data.target_week + 'Z');
            setCurrentWeek(newStartDate);
        }

        if (data.status != 200 && isSelfSent) {
            if (data.action == "PATCH") {
                if (data.activities.length > 0) {
                    const activity = data.activities[0]

                    // If the update wasn't successful, replace the client's version of the activity
                    // with the server's version
                    updateActivity(activity.id, getDraggableActivityData(activity))
                }
            }
            return;
        }

        if (data.action == RequestActions.GetWeekOfActivities) {
            const newActivities = getSchedulerActivityMap(data.activities)
            setActivities(newActivities)
            return;
        }
        
        if (!isSelfSent) {
            // Update was initiated by another client, sync
            if (data.action == RequestActions.Delete) {
                updateActivity(data.activities[0].id, null)
            }
            else {
                const newActivity = getDraggableActivityData(data.activities[0])
                updateActivity(newActivity.id, newActivity)          
            }
        }
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

    return [activities, currentWeek, isLoadingForm, activityFormInitValue, loadActivityForm, moveActivity, changeWeek] as const
}