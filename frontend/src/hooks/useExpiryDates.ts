import { useMemo } from "react";

type Exchange = "NSE" | "BSE";
type CallType = "Cash" | "Futures" | "Option Call" | "Option Put";

/**
 * Exchange-wise weekly expiry day
 * NSE  → Tuesday (2)
 * BSE  → Thursday (4)
 */
const WEEKDAY_MAP: Record<Exchange, number> = {
    NSE: 2,
    BSE: 4,
};

/**
 * Get all weekly expiries (Tue / Thu) for next N months
 */
function getNextWeeklyExpiries(
    exchange: Exchange,
    monthsAhead = 3
): Date[] {
    const result: Date[] = [];
    const targetDay = WEEKDAY_MAP[exchange];

    const today = new Date();
    const end = new Date(
        today.getFullYear(),
        today.getMonth() + monthsAhead,
        0
    );

    const d = new Date(today);

    while (d <= end) {
        if (d.getDay() === targetDay) {
            result.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
    }

    return result;
}

/**
 * Get last specific weekday of a given month
 * Example: last Tuesday / last Thursday
 */
function getLastWeekdayOfMonth(
    year: number,
    month: number, // 0-based
    weekday: number // 0=Sun ... 6=Sat
): Date {
    const d = new Date(year, month + 1, 0); // last day of month

    while (d.getDay() !== weekday) {
        d.setDate(d.getDate() - 1);
    }

    return d;
}

/**
 * Futures expiry:
 * NSE → last Tuesday of the month
 * BSE → last Thursday of the month
 */
function getFuturesExpiryByExchange(
    exchange: Exchange,
    monthOffset = 0
): Date {
    const today = new Date();
    const targetWeekday = WEEKDAY_MAP[exchange];

    const year = today.getFullYear();
    const month = today.getMonth() + monthOffset;

    return getLastWeekdayOfMonth(year, month, targetWeekday);
}

/**
 * Main hook
 */
export function useExpiryDates(
    callType: CallType,
    exchange: Exchange
) {
    return useMemo(() => {
        // Cash → no expiry
        if (callType === "Cash") {
            return [];
        }

        // Futures → next 3 months (last Tue / Thu)
        if (callType === "Futures") {
            return [
                getFuturesExpiryByExchange(exchange, 0),
                getFuturesExpiryByExchange(exchange, 1),
                getFuturesExpiryByExchange(exchange, 2),
            ];
        }

        // Options → weekly expiries
        return getNextWeeklyExpiries(exchange);
    }, [callType, exchange]);
}
