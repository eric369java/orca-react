import { ActionIcon, Switch, } from '@mantine/core'
import { CalendarPlus, ChevronLeft, ChevronRight, EllipsisVertical } from 'lucide-react'
import './SchedulerToolbar.css'

type SchedulerToolbarProps = {
    setCanDelete : React.Dispatch<React.SetStateAction<boolean>>,
    setCanDrag : React.Dispatch<React.SetStateAction<boolean>>,
    changWeek : (offset : number) => void,
}

export function SchedulerToolbar({setCanDelete, setCanDrag, changWeek} : SchedulerToolbarProps) {
    return (
        <div className='scheduler-toolbar-root'>
            <div className='scheduler-display-settings'>
                <ActionIcon variant='subtle' size='lg' onClick={e => changWeek(-1)}>
                    <ChevronLeft />
                </ActionIcon>
                <ActionIcon variant='subtle' size='lg' onClick={e => changWeek(1)}>
                    <ChevronRight />
                </ActionIcon>
            </div>
            <div className='scheduler-activity-settings'>
                <ActionIcon variant='subtle' size='lg'>
                    <CalendarPlus />
                </ActionIcon>
                <Switch label='Delete' size='md' onChange={e => setCanDelete(e.currentTarget.checked)}/>
                <Switch label='Drag' size='md' onChange={e => setCanDrag(e.currentTarget.checked)}/>
                <ActionIcon variant='subtle' size='lg'>
                    <EllipsisVertical />
                </ActionIcon>
            </div>
        </div>
    )
}