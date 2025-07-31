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
    const [activities, currentWeek, moveActivity, changeWeek] = useScheduler(testUrl,
        "847e5832-3250-4def-bd45-e3deccc70cf9", "1f572a18-d3e5-4cec-9db0-835c2752c928");

    const openActivity = useCallback((id: string) => {
        open();
    }, []);

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
                    changeWeek={changeWeek}
                />
            </div>
        </main>
    );
}
