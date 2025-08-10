import { Select, } from "@mantine/core";
import { Clock2, WalletCards, CircleDashed, Calendar1, MapPin } from "lucide-react";
import CurrencyInput from "../core/CurrencyInput";
import SectionWrapper from "./SectionWrapper";
import { ACTIVITY_TYPES } from "./constants";
import TimeRangePicker from "../core/TimeRangePicker";
import { DatePickerInput } from "@mantine/dates";
import Geocoder from "../core/Geocoder";
import type { UseFormReturnType } from "@mantine/form";

type ActivityDetailsEditorProps = {
    form : UseFormReturnType<ActivityForm>
}

export default function ActivityDetailsEditor({form}: ActivityDetailsEditorProps) {
    const activityTypePickerOptions = Object.entries(ACTIVITY_TYPES).map((kvp) => ({ value: kvp[0], label: kvp[1] }));
    
    const onCostChange = (value : string | undefined) => {
        form.setFieldValue('cost', value)
    }

    const onTimeRangeChange = (value: string | undefined, isStartTime: boolean) => {
        if (isStartTime) {
            form.setFieldValue('startTime', value)
        }
        else {
            form.setFieldValue('endTime', value)
        }
    }

    return (
        <div>
            <SectionWrapper title="Type" Icon={CircleDashed}>
                <Select key={form.key('type')}
                    data={activityTypePickerOptions}
                    {...form.getInputProps('type')}
                    withCheckIcon={false} />
            </SectionWrapper>
            <SectionWrapper title="Date" Icon={Calendar1}>
                <DatePickerInput placeholder="Pick date"
                    key={form.key('date')}
                    {...form.getInputProps('date')}
                    valueFormat="YYYY-MM-DD"/>
            </SectionWrapper>
            <SectionWrapper title="Time" Icon={Clock2}>
                <TimeRangePicker initialStartTime={form.getValues().startTime}
                    initialEndTime={form.getValues().endTime}
                    onChange={onTimeRangeChange} />
            </SectionWrapper>
            <SectionWrapper title='Budget' Icon={WalletCards}>
                <CurrencyInput initialValue={form.getValues().cost}
                    onChange={onCostChange}/>
            </SectionWrapper>
            <SectionWrapper title="Location" Icon={MapPin}>
                <Geocoder />
            </SectionWrapper>
        </div>
    );
}