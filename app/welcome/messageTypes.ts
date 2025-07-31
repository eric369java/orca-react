type ActivityRequest = {
    id : string,
    client_id : string, 
    action : "GETWEEK" | "GET" | "POST" | "PATCH" | "DELETE",
    target_week : string // ISO8601 format datetime,
    activity_id : string | null,
    description : string | null,
    activity : Activity | null
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
    version : number
}