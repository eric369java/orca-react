import { serializeDate } from "./utilities"

export class SchedulerRequestFactory {
    static createGetWeekRequest(clientId: string, weekStart : Date) : ActivityRequest {
        return {
            id : this.generateRequestId(),
            client_id  : clientId,
            action : "FULLWEEK",
            target_week : serializeDate(weekStart),
            activity_id : undefined,
            description : undefined, 
            activity : undefined
        } as ActivityRequest
    }

    static createPatchRequest(activityId: string, activity: Activity, clientId: string, weekStart : Date) : ActivityRequest {
        return {
            id : this.generateRequestId(),
            client_id : clientId,
            action : "PATCH",
            target_week : serializeDate(weekStart),
            activity_id : activityId,
            description : undefined,
            activity : activity
        } as ActivityRequest
    }

    static createGetRequest(activityId : string, clientId: string, weekStart : Date) {
        return {
            id : this.generateRequestId(),
            client_id : clientId,
            action : "GET",
            target_week : serializeDate(weekStart),
            activity_id : activityId,
            description : undefined,
            activity : undefined
        } as ActivityRequest
    }

    static generateRequestId() : string {
        // Ids only have to be unique within one user session. We can reasonably assume
        // this generated id is unique in that context.
        return Date.now().toString(16) + Math.floor(Math.random() * 100);
    }
}