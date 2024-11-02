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

export const convertMillisToTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const hoursString = hours > 0 ? hours < 10 ? `0${hours}:` : `${hours}:` : ''

    return `${hoursString}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}