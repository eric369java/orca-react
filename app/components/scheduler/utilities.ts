import { HALF_HOUR_GRID_HEIGHT, ONE_DAY_GRID_WIDTH } from './constants'

export function snapToSchedulerGrid(x: number, y: number): [number, number] {
    const snappedX = Math.round(x / ONE_DAY_GRID_WIDTH) * ONE_DAY_GRID_WIDTH
    const snappedY = Math.round(y / HALF_HOUR_GRID_HEIGHT) * HALF_HOUR_GRID_HEIGHT
    return [snappedX, snappedY]
}

export function willOverlap1D(min1: number, max1: number, min2: number, max2: number) {
    return max1 > min2 && max2 > min1;
}

export function willActivitiesOverlap(event1: DraggableActivityData, event2: DraggableActivityData) {
    return willOverlap1D(event1.left, event1.left + ONE_DAY_GRID_WIDTH, event2.left, event2.left + ONE_DAY_GRID_WIDTH) &&
        willOverlap1D(event1.top, event1.top + event1.height, event2.top, event2.top + event2.height);
}