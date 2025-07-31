import { deserializeDate, getDraggableActivityData, getSchedulerActivityMap } from "./utilities";

export default class SchedulerRequestManager {
    private buffer : Array<string> = [];
    private websocket : WebSocket | undefined;

    updateCurrentWeek : ((newStartDate : Date) => void) | undefined;
    updateActivity : ((id: string, newActivity : DraggableActivityData | null) => void ) | undefined;
    updateSchedule : ((newActivities : SchedulerActivityMap) => void) | undefined;

    constructor() {
    }

    connect(url : string) {
        this.websocket = new WebSocket(url);

        this.websocket.onmessage = (event : MessageEvent) => {
            this.syncSchedule(event);
        }   
    }

    disconnect() {
        this.buffer = []
        this.websocket?.close();
    }

    sendActivityRequest(request : ActivityRequest) {
        if (!this.websocket) {
            return
        }
        
        this.buffer.push(request.id)
        this.websocket.send(JSON.stringify(request))
    }

    private syncSchedule(event : MessageEvent) {        
        const data = JSON.parse(event.data)

        if (this.updateCurrentWeek && data.target_week) {
            const newStartDate = deserializeDate(data.target_week + 'Z');
            this.updateCurrentWeek(newStartDate);
        }

        if (!(this.updateActivity && this.updateSchedule)) {
            return;
        }

        console.log(data.status)

        // Clients only receive failed requests if they were the sender
        if (data.status != 200) {
            if (data.action == "PATCH") {
                if (data.activities.length > 0) {
                    const activity = data.activities[0]

                    // If the update wasn't successful, replace the client's version of the activity
                    // with the server's version
                    this.updateActivity(activity.id, getDraggableActivityData(activity))
                    this.acknowledge(data.request_id)
                }
            }
            return;
        }

        if (data.action == "GETWEEK") {
            const newActivities = getSchedulerActivityMap(data.activities)
            this.updateSchedule(newActivities)
            this.acknowledge(data.request_id)
            return
        }

        if (this.acknowledge(data.request_id)) {
            // Request was successful and sent by this client, skip updating 
            return
        }

        // Update was initiated by another client, sync
        if (data.action == "DELETE") {
            this.updateActivity(data.activities[0].id, null)
        }
        else {
            const newActivity = getDraggableActivityData(data.activities[0])
            this.updateActivity(newActivity.id, newActivity)          
        }
    }

    private acknowledge(id : string) : boolean {
        const index = this.buffer.findIndex(element => {
            return element === id;
        })

        if (index != -1) {
            // We don't care about the order of objects, so can quickly remove by swapping
            this.buffer[index] = this.buffer[this.buffer.length - 1];
            this.buffer.pop()
            return true
        }

        return false
    }
}