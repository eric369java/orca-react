import { TimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './TimeRangePicker.css';

type TimeRangePickerProps = {
    timeRange: TimeRange,
    onChange: (timeRange: TimeRange) => void
}

export default function TimeRangePicker({ timeRange, onChange }: TimeRangePickerProps) {
    const getUpdatedTimeRange = (time: string, isStart: boolean) => {
        const newRange : TimeRange = {
            start: isStart ? time : timeRange.start,
            end: isStart ? timeRange.end : time
        }
        return newRange;
    }
    
    return (
        <div className='time-range-picker'>
            <TimePicker className='time-picker'
                value={timeRange.start}
                onChange={(value) => onChange(getUpdatedTimeRange(value, true))}
                minutesStep={10}
                withDropdown={true}
                format='12h' />
            <label className='dark-gray'>To</label>
            <TimePicker className='time-picker'
                value={timeRange.end}
                onChange={(value) => onChange(getUpdatedTimeRange(value, false))}
                minutesStep={10}
                withDropdown={true}
                format='12h' />
        </div>
    );
}