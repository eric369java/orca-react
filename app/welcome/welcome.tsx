import { useDisclosure } from "@mantine/hooks";
import { useCallback } from "react";
import Panel from "~/components/panel/Panel";
import Scheduler from "~/components/scheduler/Scheduler";
import ActivityDetails from "~/components/activity/ActivityDetails";
import useScheduler from "./useScheduler";

const testUrl =
    "ws://localhost:8000/v1/schedule/847e5832-3250-4def-bd45-e3deccc70cf9/1f572a18-d3e5-4cec-9db0-835c2752c928";

export function Welcome() {
    const [opened, { open, close }] = useDisclosure(false);
    const [activities, currentWeek, moveActivity, sendScheduleMessage] = useScheduler(testUrl);

    const openActivity = useCallback((id: string) => {
        open();
    }, []);

    const shiftCurrentWeek = (numWeeks: number) => {
        if (!currentWeek || !Number.isInteger(numWeeks)) {
            return;
        }

        const nextWeek = new Date(currentWeek);
        nextWeek.setUTCDate(currentWeek.getUTCDate() + numWeeks * 7);
        const clientScheduleMessage: ClientScheduleMessage = {
            client_id: "1f572a18-d3e5-4cec-9db0-835c2752c928",
            type: "schedule",
            action: "STEP",
            schedule_id: "847e5832-3250-4def-bd45-e3deccc70cf9",
            current_week: nextWeek.toISOString().split(".")[0],
        };

        sendScheduleMessage(clientScheduleMessage);
    };

    const content = <ActivityDetails id="abc" close={close} />;
    return (
        <main>
            <div>
                <Panel
                    content={content}
                    position="right"
                    opened={opened}
                    close={close}
                />
                <Scheduler
                    activities={activities}
                    currentWeek={currentWeek}
                    openActivity={openActivity}
                    moveActivity={moveActivity}
                    shiftCurrentWeek={shiftCurrentWeek}
                />
            </div>
        </main>
    );
}
