import './WeekHeader.css'

type WeekHeaderProps = {
    startDate : Date | undefined
}

// TODO: Localize
const DAYS_OF_THE_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeekHeader({startDate} : WeekHeaderProps) {
    const weekdays = [0, 1, 2, 3, 4, 5, 6].map(offset => {
        let dateString;
        let weekDayString;

        if (startDate) {
            const date = new Date(startDate);
            date.setUTCDate(date.getUTCDate() + offset)
            dateString = date.getUTCDate().toString()
            weekDayString = DAYS_OF_THE_WEEK[(date.getUTCDay() + 6) % 7]          
        }
        
        return (
            <div className='week-day-container' key={offset}>
                <label className='date-span'>{dateString}</label>
                <label className='weekday-span'>{weekDayString}</label>
            </div>
        );
    })

    return (
        <div className="week-header-container">
            {weekdays}
        </div>
    )
}