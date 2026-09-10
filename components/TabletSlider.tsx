import type { JSX } from "preact";

interface TabletSliderProps {
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
}

export default function TabletSlider({ value, disabled, onChange }: TabletSliderProps): JSX.Element {
    return (
        <fieldset disabled={disabled} class="control-group disabled:opacity-50">
            <legend class="control-legend">Area scale</legend>
            <div class="flex flex-wrap items-center gap-4">
                <input
                    type="range"
                    aria-label="Area scale slider"
                    min="0"
                    max="100"
                    step="0.01"
                    value={Number(value) || 0}
                    onInput={(event) => onChange(event.currentTarget.value)}
                    class="min-w-0 max-w-full flex-1 basis-32 accent-blue-600 dark:accent-blue-400"
                />
                <div class="flex min-w-0 w-[7.5rem] max-w-full items-center gap-2">
                    <input
                        type="number"
                        aria-label="Area scale percentage"
                        aria-describedby="scale-help"
                        min="0"
                        max="100"
                        step="any"
                        value={value}
                        onInput={(event) => onChange(event.currentTarget.value)}
                        class="field-input min-w-0 flex-1 w-24"
                    />
                    <span aria-hidden="true">%</span>
                </div>
            </div>
            <p id="scale-help" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                100% is the largest area that fits at the current ratio. 50% halves both dimensions.
            </p>
        </fieldset>
    );
}
