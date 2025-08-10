import { HALF_HOUR_GRID_HEIGHT, ONE_DAY_GRID_WIDTH } from "~/components/scheduler/constants";

export function deserializeDate(dateString: string) : Date {
    const date = Date.parse(dateString.split('+')[0])
    return new Date(date)
}

export function serializeDate(date: Date) : string {
    return date.toISOString().split(".")[0];
}

export function dateRangeToGridHeight(startDate: Date, endDate: Date) : number {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60) * (HALF_HOUR_GRID_HEIGHT / 30))
}

export function dateToGridCoordinates(UTCDate: Date) : [number, number] {
    // Date.getUTCDay() has Sunday = 0. Saturday = 6. Shift so that Monday = 0
    const x = ((UTCDate.getUTCDay() + 6) % 7) * ONE_DAY_GRID_WIDTH;
    const y = ((60 * UTCDate.getUTCHours()) + UTCDate.getUTCMinutes()) * (HALF_HOUR_GRID_HEIGHT / 30);
    return [x, y];
}

export function gridCoordinatesToDate(startDate: Date, x: number, y: number) : Date {
    const date = new Date(startDate);
    const hours = y / (2 * HALF_HOUR_GRID_HEIGHT);
    const minutes = y % ( 2 * HALF_HOUR_GRID_HEIGHT);

    date.setUTCDate(startDate.getUTCDate() + (x / ONE_DAY_GRID_WIDTH));
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    return date;
}

export const getActivityForm = (activity : Activity, description : string): ActivityForm => {
    const date = activity.start.split('T')[0]
    const startTime = activity.start.split('T')[1]
    const endTime = activity.end.split('T')[1] 

    let {start, end, ...activityProperties} = activity 

    return {
        ...activityProperties,
        date : date,
        startTime : startTime,
        endTime : endTime,
        description : description
    } as ActivityForm
}

export function getActivity(draggableActivityData : DraggableActivityData, startDate: Date) : Activity {
    const { scheduleId, left, top, localTimezone, destLocation, ...otherEntries} = draggableActivityData

    const start = gridCoordinatesToDate(startDate, left, top)
    const end = gridCoordinatesToDate(startDate, left, top + draggableActivityData.height)
    const activity : Activity = {
        ...otherEntries,
        schedule_id : scheduleId, 
        start : serializeDate(start),
        end : serializeDate(end),
        local_timezone : localTimezone,
        dest_location : destLocation
    }

    return activity
}

export function getDraggableActivityData(activityJson : any) : DraggableActivityData {
    const astart = deserializeDate(activityJson.start + 'Z')
    const aend = deserializeDate(activityJson.end + 'Z')
    const [left, top] = dateToGridCoordinates(astart)
    const height = dateRangeToGridHeight(astart, aend)

    const { schedule_id, start, end, local_timezone, dest_location, ...otherEntries} = activityJson
    const draggableActivityData : DraggableActivityData = {
        ...otherEntries,
        scheduleId : schedule_id,
        left : left,
        top : top,
        height : height,
        localTimezone : local_timezone,
        destLocation : dest_location
    }

    return draggableActivityData
}

export function getSchedulerActivityMap(activitiesJson : any) : SchedulerActivityMap {
    return activitiesJson.reduce((map : any, activity : any) => {
        map[activity.id] = getDraggableActivityData(activity)
        return map
    }, {});
}