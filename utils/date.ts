export const getDayName = (day: number): string => {
    switch (day) {
        case 0:
            return 'sun'
        case 1:
            return 'mon'
        case 2:
            return 'tue'
        case 3:
            return 'wed'
        case 4:
            return 'thu'
        case 5:
            return 'fri'
        case 6:
            return 'sat'
        default:
            return 'invalid number'
    }
}

export const compareDates = (d1: Date, d2: Date): number => {
    const d1Time = d1.getTime()
    const d2Time = d2.getTime()

    if (d1Time > d2Time) {
        return 1
    } else if (d1Time < d2Time) {
        return -1
    } else {
        return 0
    }
}