type DraggableActivityData = { 
    id: string
    title: string
    left: number
    top: number
    height: number
    type: string
    cost: string | undefined | null
    location: string | undefined | null
    localTimezone: number
    destLocation: string | undefined | null
}

type SchedulerActivityMap = {
    [key: string]: DraggableActivityData
}
