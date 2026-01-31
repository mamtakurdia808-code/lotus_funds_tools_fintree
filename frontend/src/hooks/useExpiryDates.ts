import { useMemo } from "react";

type Exchange = "NSE" | "BSE";
type CallType = "Cash" | "Futures" | "Option Call" | "Option Put";

const WEEKDAY_MAP: Record<Exchange, number> = {
    NSE: 2, // Tuesday
    BSE: 4, // Thursday
};

function getNextWeeklyExpiries(exchange: Exchange, monthsAhead = 3) {
    const result: Date[] = [];
    const targetDay = WEEKDAY_MAP[exchange];
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth() + monthsAhead, 0);

    const d = new Date(today);

    while (d <= end) {
        if (d.getDay() === targetDay) {
            result.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
    }

    return result;
}

function getFuturesExpiry(monthOffset = 0) {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset + 1, 0);

    while (d.getDay() === 0 || d.getDay() === 6) {
        d.setDate(d.getDate() - 1);
    }

    return d;
}

export function useExpiryDates(
    callType: CallType,
    exchange: Exchange
) {
    return useMemo(() => {
        if (callType === "Cash") {
            return [];
        }

        if (callType === "Futures") {
            return [
                getFuturesExpiry(0),
                getFuturesExpiry(1),
                getFuturesExpiry(2),
            ];
        }

        // Option Call / Put
        return getNextWeeklyExpiries(exchange);
    }, [callType, exchange]);
}
