import { useMemo, useState } from "react";
import { STOCK_DATA } from "../assets/stocks";

type ExchangeType = "NSE" | "BSE";

export function useStockAutocomplete(exchangeType: ExchangeType) {
    const [inputValue, setInputValue] = useState("");
    const [suggestion, setSuggestion] = useState("");

    const options = useMemo(() => {
        const raw = STOCK_DATA[exchangeType] || [];
        return raw.map((s) => ({
            original: s,
            lower: s.toLowerCase(),
        }));
    }, [exchangeType]);

    const matches = useMemo(() => {
        if (!inputValue) return [];

        const lowerInput = inputValue.toLowerCase();

        return options
            .filter((s) => s.lower.startsWith(lowerInput))
            .slice(0, 20)
            .map((s) => s.original);
    }, [inputValue, options]);

    const handleInputChange = (_: any, value: string) => {
        setInputValue(value);

        if (value.length > 0) {
            const firstMatch = options.find((s) =>
                s.lower.startsWith(value.toLowerCase())
            );
            setSuggestion(firstMatch?.original || "");
        } else {
            setSuggestion("");
        }
    };

    const setDirectValue = (value: string) => {
        setInputValue(value);
        setSuggestion("");
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Tab" && suggestion) {
            setInputValue(suggestion);
            setSuggestion("");
            event.preventDefault();
        }
    };

    return {
        inputValue,
        setDirectValue,
        suggestion,
        matches,
        handleInputChange,
        handleKeyDown,
    };
}