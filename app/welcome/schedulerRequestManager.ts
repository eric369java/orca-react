import { RequestActions } from "./constants";

export default class SchedulerRequestManager {
    private sentRequests : Array<string> = [];
    private websocket : WebSocket | undefined;
    private latestGetRequest : string | undefined;

    onResponse : ((data : any, isSelfSent : boolean) => void) | undefined
    onDescriptionLoaded : ((data : any) => void) | undefined

    constructor() {
    }

    connect(url : string) {
        this.websocket = new WebSocket(url);

        this.websocket.onmessage = (event : MessageEvent) => {
            const data = JSON.parse(event.data);
            if (!this.onDescriptionLoaded || !this.onResponse) {
                return;
            }

            if (data.action === RequestActions.Get) {
                // If the incoming details doesn't correspond to the latest opened activity, ignore
                const shouldAlert = this.acknowledge(data.request_id) && data.activity_id === this.latestGetRequest;
                if (shouldAlert) {
                    this.onDescriptionLoaded(data)
                }
            }
            else {
                const isSelfSent = this.acknowledge(data.request_id)
                this.onResponse(data, isSelfSent);
            }
        }   
    }

    disconnect() {
        this.sentRequests = [];
        this.websocket?.close();
    }

    sendActivityRequest(request : ActivityRequest) {
        if (!this.websocket) {
            return
        }
        
        if (request.action === RequestActions.Get) {
            this.latestGetRequest = request.activity_id
        }

        this.sentRequests.push(request.id)
        this.websocket.send(JSON.stringify(request))
    }

    private acknowledge(id : string) : boolean {
        const index = this.sentRequests.findIndex(element => {
            return element === id;
        })

        if (index != -1) {
            // We don't care about the order of objects, so can quickly remove by swapping
            this.sentRequests[index] = this.sentRequests[this.sentRequests.length - 1];
            this.sentRequests.pop()
            return true
        }

        return false
    }
}