import { HALF_HOUR_GRID_HEIGHT, ONE_DAY_GRID_WIDTH } from "~/components/scheduler/constants";

export function deserializeDate(dateString: string) : Date {
    const date = Date.parse(dateString.split('+')[0])
    return new Date(date)
}

export function dateToGridXY(UTCDate: Date) : [number, number] {
    // Date.getUTCDay() has Sunday = 0. Saturday = 6. Shift so that Monday = 0
    const x = ((UTCDate.getUTCDay() + 6) % 7) * ONE_DAY_GRID_WIDTH;
    const y = ((60 * UTCDate.getUTCHours()) + UTCDate.getUTCMinutes()) * (HALF_HOUR_GRID_HEIGHT / 30);
    return [x, y];
}

export function dateRangeToGridHeight(startDate: Date, endDate: Date) : number {
    return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60) * (HALF_HOUR_GRID_HEIGHT / 30))
}

export function gridXYToDate(startDate: Date, x: number, y: number) : Date {
    const date = new Date(startDate);
    const hours = y / (2 * HALF_HOUR_GRID_HEIGHT);
    const minutes = y % ( 2 * HALF_HOUR_GRID_HEIGHT);

    date.setDate(startDate.getUTCDate() + (x / ONE_DAY_GRID_WIDTH));
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}