type ActivityRequest = {
    id : string,
    client_id : string, 
    action : "FULLWEEK" | "GET" | "POST" | "PATCH" | "DELETE",
    target_week : string // ISO8601 format datetime,
    activity_id : string | undefined,
    description : string | undefined,
    activity : Activity | undefined
}