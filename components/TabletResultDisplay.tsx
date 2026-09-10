import type { JSX } from "preact";

interface TabletResultDisplayProps {
    result: string;
}

export function TabletResultDisplay(
    { result }: TabletResultDisplayProps,
): JSX.Element {
    if (!result) {
        return <></>;
    }

    const lines = result.split("\n");

    return (
        <div
            role="status"
            class="mt-6 p-4 text-center font-medium rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        >
            {lines.map((line, index) => <div key={index}>{line}</div>)}
        </div>
    );
}
