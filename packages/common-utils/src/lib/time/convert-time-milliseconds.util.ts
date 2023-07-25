export function convertTimeStringToMilliseconds(timeString: string): number {
    const timeRegex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
    const matches = timeString.match(timeRegex);

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (matches) {
        if (matches[1]) {
            hours = parseInt(matches[1]);
        }
        if (matches[2]) {
            minutes = parseInt(matches[2]);
        }
        if (matches[3]) {
            seconds = parseInt(matches[3]);
        }
    }

    const totalMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    return totalMilliseconds;
}
