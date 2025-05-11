'use client'
import { useState } from "react";

export function useAIStreamingMessage() {
    const [aiMessages, setAiMessages] = useState<string>('');
    const [aiThinking, setAiThinking] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState<boolean>(false);

    const getAiMessages = async () => {
        setAiThinking(true);
        setAiMessages('');

        const res = await fetch('/api/suggest-messages', {
            method: 'POST',
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done && reader) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value);
            setAiMessages((prev) => prev + chunk);
        }

        setAiThinking(false);
        setHasFetched(true);
    };

    return { aiMessages, aiThinking, getAiMessages, hasFetched };
}

