import { TimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import './TimeRangePicker.css';

type TimeRangePickerProps = {
    initialStartTime: string | undefined,
    initialEndTime: string | undefined,
    onChange: (value: string, isStartTime: boolean) => void
}

export function TimeRangePicker({initialStartTime, initialEndTime, onChange }: TimeRangePickerProps) {
    return (
        <div className='time-range-picker'>
            <TimePicker className='time-picker'
                value={initialStartTime}
                onChange={(value) => onChange(value, true)}
                minutesStep={10}
                withDropdown={true}
                format='12h' />
            <label className='dark-gray'>To</label>
            <TimePicker className='time-picker'
                value={initialEndTime}
                onChange={(value) => onChange(value, false)}
                minutesStep={10}
                withDropdown={true}
                format='12h' />
        </div>
    );
}