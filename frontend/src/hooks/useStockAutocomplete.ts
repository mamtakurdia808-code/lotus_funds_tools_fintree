import { useMemo, useState } from "react";
import { STOCK_DATA } from "../assets/stocks";

type ExchangeType = "NSE" | "BSE";

export function useStockAutocomplete(exchangeType: ExchangeType) {
    const [inputValue, setInputValue] = useState("");
    const [suggestion, setSuggestion] = useState("");

    const options = useMemo(() => {
        return STOCK_DATA[exchangeType] || [];
    }, [exchangeType]);

    const matches = useMemo(() => {
        if (!inputValue) return [];
        return options.filter((s) =>
            s.toLowerCase().startsWith(inputValue.toLowerCase())
        );
    }, [inputValue, options]);

    const open = inputValue.length > 0 && matches.length > 1;

    const handleInputChange = (_: any, value: string) => {
        setInputValue(value);

        if (value.length > 0 && matches.length > 0) {
            setSuggestion(matches[0]);
        } else {
            setSuggestion("");
        }
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
        setInputValue,
        suggestion,
        options,
        open,
        handleInputChange,
        handleKeyDown,
    };
}
