import { ActionIcon, Tooltip } from "@mantine/core";
import { Save, SquarePenIcon, X } from "lucide-react";
import './ActivityDetails.css';
import { useState } from "react";
import { useActivityConfig } from "./useActivityConfig";
import ActivityDetailsEditor from "./ActivityDetailsEditor";

type ActivityDetailsProps = {
    id: string,
    close: () => void
}

export default function ActivityDetails({ id, close }: ActivityDetailsProps) {
    const [title, date, timeRange, cost, activityType,
        updateTitle, updateDate, updateTimeRange, updateCost, updateActivityType] = useActivityConfig(id, false); // MOCK: Wire IsCreating
    const [description, setDescription] = useState<string>();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const updateDescription = (description: string) => {
        setDescription(description);
    }

    return (
        <div>
            <div className="activity-details-header">
                <label className="activity-details-heading">{title}</label>
                <div className="button-group">
                    <Tooltip label={isEditing ? 'Save' : 'Edit'}>
                        <ActionIcon variant='subtle' size='md' onClick={() => setIsEditing(isEditing => !isEditing)}>
                            {isEditing ? <Save /> : <SquarePenIcon />}
                        </ActionIcon>
                    </Tooltip>
                    <ActionIcon variant='subtle' size='md' onClick={close}>
                        <X />
                    </ActionIcon>
                </div>
            </div>
            <ActivityDetailsEditor activityType={activityType} date={date} timeRange={timeRange} cost={cost}
                description={description} updateActivityType={updateActivityType} updateDate={updateDate} updateTimeRange={updateTimeRange} 
                updateCost={updateCost} updateDescription={updateDescription}/>
        </div>
    );
}