type DraggableActivityData = { 
    id: string
    scheduleId : string
    title: string
    left: number
    top: number
    height: number
    type: string
    cost: string | undefined | null
    location: string | undefined | null
    localTimezone: number
    destLocation: string | undefined | null
    version: number
}

type SchedulerActivityMap = {
    [key: string]: DraggableActivityData
}
