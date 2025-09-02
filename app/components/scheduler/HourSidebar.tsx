import './HourSidebar.css'

export function HourSidebar() {
    const hours = Array.from(Array(24).keys()).map(hour => {
        let hourString = hour % 12 === 0 ? "12" : `${hour % 12}`;
        let meridium = hour / 12 >= 1 ? "PM" : "AM";
        return (
            <div className='hour-span-container' key={hour}>
                <label className='hour-span'>{hourString + ":00 " + meridium}</label>
            </div>
        )
    });

    return (
        <div className='hour-sidebar-container'>
            {hours}
        </div>
    )
}