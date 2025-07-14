import type { CSSProperties } from 'react'
import './SchedulerActivity.css'

type SchedulerActivityProps = {
    id : string,
    title : string,
    height : number,
    openActivity? : (id : string) => void
}

function getStyles(height: number) : CSSProperties {
    return {
        height: `${height}px`
    };
}

export default function SchedulerActivity({ id, title, height, openActivity } : SchedulerActivityProps) {

    // TODO: onclick (call store), indicate cost, different appearances depending on type
    return (
        <div className='scheduler-activity' style={getStyles(height)} onClick={() => openActivity?.(id)}>
            {title}
        </div>
    )
}