type ClientMessage = {
    type : "activity" | "schedule"
    client_id : string
}

type ClientActivityMessage = ClientMessage & {
    action : "GET" | "POST" | "UPDATE" | "DELETE"
    activity_id : string | undefined
    activity: Activity | undefined
    description: string | undefined   
}

type ClientScheduleMessage = ClientMessage & {
    action: "STEP"
    schedule_id : string
    current_week : string // ISO8601 format datetime
}

type Activity = {
    id : string, 
    schedule_id: string 
    title: string
    type: string
    cost: string | undefined | null
    start : string // ISO8601 format datetime
    end : string // ISO8601 format datetime
    location: string | undefined | null
    local_timezone: number
    dest_location: string | undefined | null
}