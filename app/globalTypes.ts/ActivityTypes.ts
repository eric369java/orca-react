
type Activity = {
    id : string, 
    schedule_id: string 
    title: string
    type: string
    cost: string | undefined
    start : string // ISO8601 format datetime
    end : string // ISO8601 format datetime
    location: string | undefined
    local_timezone: number
    dest_location: string | undefined
    version : number
}

type ActivityForm = {
    id: string | undefined
    schedule_id : string | undefined
    title: string | undefined
    date: string | undefined
    startTime: string | undefined
    endTime: string | undefined    
    type: string | undefined
    cost: string | undefined
    location: string | undefined
    local_timezone: number | undefined
    dest_location: string | undefined
    version: number | undefined
    description: string | undefined
}