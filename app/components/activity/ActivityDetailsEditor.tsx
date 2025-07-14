import { Select, Textarea } from "@mantine/core";
import { Clock2, WalletCards, CircleDashed, Info, Calendar, Calendar1 } from "lucide-react";
import CurrencyInput from "../core/CurrencyInput";
import SectionWrapper from "./SectionWrapper";
import { ACTIVITY_TYPES } from "./constants";
import TimeRangePicker from "../core/TimeRangePicker";
import { DatePickerInput } from "@mantine/dates";

type ActivityDetailsEditorProps = {
    activityType : string,
    date : string,
    timeRange : TimeRange,
    cost : Cost,
    description : string | undefined,
    updateActivityType : (activityType : string) => void,
    updateDate : (date: string) => void,
    updateTimeRange : (timeRange : TimeRange) => void,
    updateCost : (cost: Cost) => void,
    updateDescription : (description : string) => void
}

export default function ActivityDetailsEditor({activityType, date, timeRange, cost, description,
    updateActivityType, updateDate, updateTimeRange, updateCost, updateDescription}: ActivityDetailsEditorProps) {
    const activityTypePickerOptions = Object.entries(ACTIVITY_TYPES).map((kvp) => ({ value: kvp[0], label: kvp[1] }));
    return (
        <div>
            <SectionWrapper title="Type" Icon={CircleDashed}>
                <Select value={activityType} data={activityTypePickerOptions} onChange={(value, _) => updateActivityType(value ?? 'Default')} withCheckIcon={false} />
            </SectionWrapper>
            <SectionWrapper title="Date" Icon={Calendar1}>
                <DatePickerInput value={date} onChange={value => updateDate(value)}/>
            </SectionWrapper>
            <SectionWrapper title="Time" Icon={Clock2}>
                <TimeRangePicker timeRange={timeRange} onChange={updateTimeRange} />
            </SectionWrapper>
            <SectionWrapper title='Budget' Icon={WalletCards}>
                <CurrencyInput cost={cost} userCurrencySetting="CAD" onChange={updateCost} />
            </SectionWrapper>
        </div>
    );
}