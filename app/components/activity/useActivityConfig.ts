import { useEffect, useState } from "react"
import { MAX_TITLE_LENGTH } from "./constants";

export function useActivityConfig(id: string, isCreating: boolean) {
    const [title, setTitle] = useState<string>();
    const [date, setDate] = useState<string>('2025-06-02'); // TODO : Initialize properly
    const [timeRange, setTimeRange] = useState<TimeRange>({start: '00:00', end: '01:00'}); // TODO: autoplace it better
    const [cost, setCost] = useState<Cost>({value: 2000, currencyString: 'JPY'});
    const [activityType, setActivityType] = useState<string>('Attraction');

    const saveActivityDetails = () => {
        // validate form
        // update activity in calendar
        // save state to backend
    }

    const updateTitle = (title: string) => {
        if (title.length > MAX_TITLE_LENGTH) {
            return;
        }

        setTitle(title.replace(/\W/g, ''));
    }

    const updateDate = (date : string) => {
        setDate(date);
    }

    const updateTimeRange = (timeRange: TimeRange) => {
        setTimeRange(timeRange);
    }

    const updateCost = (cost: Cost) => {
        setCost(cost);
    }

    const updateActivityType = (activityType: string | null) => {
        setActivityType(activityType ?? 'Attraction');
    }

    useEffect(() => {
        // load and set activity details
        setTitle('Tokyo Skytree');
    }, [id, isCreating]);

    return [title, date, timeRange, cost, activityType, updateTitle, updateDate, updateTimeRange, updateCost, updateActivityType] as const;
}