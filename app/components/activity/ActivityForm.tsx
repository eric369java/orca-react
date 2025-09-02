import { ActionIcon, Box, LoadingOverlay, Tooltip} from "@mantine/core";
import { Save, X } from "lucide-react";
import './ActivityForm.css';
import { ActivityDetailsEditor } from "./ActivityDetailsEditor";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";

const emptyForm : ActivityForm = {
    id: undefined,
    schedule_id : undefined,
    title: undefined,
    date: undefined,
    startTime: undefined,
    endTime: undefined,
    type: undefined,
    cost: undefined,
    location: undefined,
    local_timezone: undefined,
    dest_location: undefined,
    version: undefined,
    description: undefined,
}

type ActivityFormProps = {
    initialValues : ActivityForm | undefined
    isLoading : boolean
    close: () => void
}

export function ActivityForm({ initialValues, isLoading, close }: ActivityFormProps) {
    const [visible, { toggle }] = useDisclosure(false);

    const form = useForm<ActivityForm>({
        mode: 'uncontrolled',
        initialValues: initialValues ? initialValues : emptyForm,
    })

    useEffect(() => {
        form.setValues(initialValues ? initialValues : emptyForm)

        if ((isLoading && !visible) || (!isLoading && visible)) {
            toggle()
        }
        
    }, [visible, isLoading, initialValues]);

    return (
        <Box pos="relative">
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <form>
                <div className="activity-header">
                    <label className="activity-heading">{"Visit Mount Fuji"}</label>
                    <div className="button-group">
                        <Tooltip label="Save">
                            <ActionIcon variant='subtle' size='md' type="submit">
                                <Save />
                            </ActionIcon>
                        </Tooltip>
                        <ActionIcon variant='subtle' size='md' onClick={close}>
                            <X />
                        </ActionIcon>
                    </div>
                </div>
                <ActivityDetailsEditor form={form}/>
            </form>
        </Box>
    );
}