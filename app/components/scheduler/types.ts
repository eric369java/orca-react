type DraggableActivityData = { 
    id: string
    scheduleId : string
    title: string
    left: number
    top: number
    height: number
    type: string
    cost: string | undefined
    location: string | undefined
    localTimezone: number
    destLocation: string | undefined
    version: number
}

type SchedulerActivityMap = {
    [key: string]: DraggableActivityData
}
