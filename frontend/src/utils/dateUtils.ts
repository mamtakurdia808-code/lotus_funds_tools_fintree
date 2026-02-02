export function getDaysBetween(from: Date, to: Date): number {
    const start = new Date(from);
    const end = new Date(to);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
}
