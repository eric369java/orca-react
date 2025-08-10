import { useDisclosure } from "@mantine/hooks";
import { useCallback, useMemo } from "react";
import Panel from "~/components/panel/Panel";
import Scheduler from "~/components/scheduler/Scheduler";
import useScheduler from "./useScheduler";
import ActivityForm from "~/components/activity/ActivityForm";

const testUrl =
    "ws://localhost:8000/v1/schedule/847e5832-3250-4def-bd45-e3deccc70cf9/1f572a18-d3e5-4cec-9db0-835c2752c928";

export function Welcome() {
    const [opened, { open, close }] = useDisclosure(false);
    const [activities, currentWeek, isLoadingForm, activityFormInitValue, loadActivityForm, moveActivity, changeWeek] = useScheduler(testUrl,
        "847e5832-3250-4def-bd45-e3deccc70cf9", "1f572a18-d3e5-4cec-9db0-835c2752c928");

    const openActivity = useCallback((id: string) => {
        // TODO : Skip load if called from create activity button
        loadActivityForm(id);

        // TODO : setTimeout to check if self close if no response
        if (!opened) {
            open()
        }
    }, []);

    const content = useMemo(() => <ActivityForm initialValues={activityFormInitValue}
        isLoading={isLoadingForm} close={close} />, [activityFormInitValue, isLoadingForm]);

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
