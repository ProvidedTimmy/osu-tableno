import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { TabletForm } from "./TabletForm.tsx";
import { TabletResultDisplay } from "./TabletResultDisplay.tsx";
import TabletSlider from "./TabletSlider.tsx";
import { calculateArea, getMaximumArea } from "../utils/calculations.ts";
import { TABLETS } from "../utils/constants/tablets.ts";
import type { TabletDimensions } from "../utils/types/tablet.ts";

type Preset = "4:3" | "16:9" | "custom";
interface Settings {
    brand: string;
    model: string;
    preset: Preset;
    ratioWidth: string;
    ratioHeight: string;
    locked: boolean;
    scale: string;
    width: string;
    height: string;
}

const positive = (value: number): boolean => Number.isFinite(value) && value > 0;
const textNumber = (value: number): string => Number(value.toFixed(8)).toString();

function selectedRatio(settings: Settings): number | null {
    if (settings.preset === "4:3") return 4 / 3;
    if (settings.preset === "16:9") return 16 / 9;
    const width = Number(settings.ratioWidth);
    const height = Number(settings.ratioHeight);
    if (![width, height].every((value) => Number.isFinite(value) && value >= 0.1 && value <= 100)) return null;
    return width / height;
}

function fitSelection(settings: Settings, tablet?: TabletDimensions): Settings {
    const ratio = selectedRatio(settings);
    const scale = positive(Number(settings.scale)) && Number(settings.scale) <= 100 ? Number(settings.scale) : 50;
    if (!tablet || !ratio) return { ...settings, width: "", height: "" };
    const area = calculateArea(tablet, scale, ratio);
    return { ...settings, scale: textNumber(scale), width: textNumber(area.width), height: textNumber(area.height) };
}

export default function TabletCalculator(): JSX.Element {
    const [settings, setSettings] = useState<Settings>({
        brand: "", model: "", preset: "4:3", ratioWidth: "4", ratioHeight: "3",
        locked: true, scale: "50", width: "", height: "",
    });
    const tablet = TABLETS[settings.brand]?.[settings.model];
    const ratio = selectedRatio(settings);
    const area = { width: Number(settings.width), height: Number(settings.height) };
    const scale = Number(settings.scale);
    let error = "";
    if (settings.locked && ratio === null) {
        error = "Enter a custom ratio using numbers from 0.1 to 100 on each side.";
    } else if (tablet) {
        if (![area.width, area.height].every(positive)) {
            error = "Enter a positive width and height.";
        } else if (area.width > tablet.width + 1e-7 || area.height > tablet.height + 1e-7) {
            error = `The area must fit inside ${tablet.width} × ${tablet.height} mm. Reduce the dimensions or change the ratio.`;
        } else if (!positive(scale) || scale > 100 + 1e-7) {
            error = "Area scale must be greater than 0 and at most 100%.";
        }
    }

    const changeRatio = (changes: Partial<Settings>): void => {
        setSettings((current) => fitSelection({ ...current, ...changes }, tablet));
    };

    const changeDimension = (axis: "width" | "height", value: string): void => {
        setSettings((current) => {
            const next = { ...current, [axis]: value };
            const lockedRatio = selectedRatio(current);
            const number = Number(value);
            if (current.locked && lockedRatio && positive(number)) {
                if (axis === "width") next.height = textNumber(number / lockedRatio);
                else next.width = textNumber(number * lockedRatio);
            }
            const width = Number(next.width);
            const height = Number(next.height);
            if (tablet && positive(width) && positive(height) && width <= tablet.width + 1e-7 && height <= tablet.height + 1e-7) {
                const maximum = getMaximumArea(tablet, current.locked && lockedRatio ? lockedRatio : width / height);
                next.scale = textNumber(Math.max(width / maximum.width, height / maximum.height) * 100);
            } else {
                next.scale = "";
            }
            return next;
        });
    };

    const changeScale = (value: string): void => {
        setSettings((current) => {
            const width = Number(current.width);
            const height = Number(current.height);
            const currentRatio = current.locked ? selectedRatio(current) : positive(width) && positive(height) ? width / height : selectedRatio(current);
            const percentage = Number(value);
            if (!tablet || !currentRatio || !positive(percentage) || percentage > 100) {
                return { ...current, scale: value };
            }
            const nextArea = calculateArea(tablet, percentage, currentRatio);
            return { ...current, scale: value, width: textNumber(nextArea.width), height: textNumber(nextArea.height) };
        });
    };

    return (
        <div class="space-y-5 text-gray-900 dark:text-gray-100">
            <div class="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
                <TabletForm
                    selectedBrand={settings.brand}
                    selectedModel={settings.model}
                    onBrandChange={(event) => setSettings((current) => ({
                        ...current, brand: (event.target as HTMLSelectElement).value,
                        model: "", width: "", height: "", scale: "50",
                    }))}
                    onModelChange={(model) => setSettings((current) => fitSelection(
                        { ...current, model, scale: "50" }, TABLETS[current.brand]?.[model],
                    ))}
                />
            </div>

            <fieldset class="control-group">
                <legend class="control-legend">Aspect ratio</legend>
                <select
                    aria-label="Aspect ratio"
                    value={settings.preset}
                    disabled={!settings.locked}
                    onChange={(event) => changeRatio({ preset: event.currentTarget.value as Preset })}
                    class="field-input w-full"
                >
                    <option value="4:3">4:3</option>
                    <option value="16:9">16:9</option>
                    <option value="custom">Custom</option>
                </select>
                {settings.preset === "custom" && (
                    <div class="dimension-grid mt-3">
                        <label class="min-w-0 flex-1 text-sm">Ratio width
                            <input type="number" min="0.1" max="100" step="any" disabled={!settings.locked}
                                value={settings.ratioWidth} onInput={(event) => changeRatio({ ratioWidth: event.currentTarget.value })}
                                class="field-input mt-1 w-full" />
                        </label>
                        <label class="min-w-0 flex-1 text-sm">Ratio height
                            <input type="number" min="0.1" max="100" step="any" disabled={!settings.locked}
                                value={settings.ratioHeight} onInput={(event) => changeRatio({ ratioHeight: event.currentTarget.value })}
                                class="field-input mt-1 w-full" />
                        </label>
                    </div>
                )}
                <label class="mt-3 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={settings.locked}
                        onChange={(event) => {
                            const locked = event.currentTarget.checked;
                            setSettings((current) => locked ? fitSelection({ ...current, locked }, tablet) : { ...current, locked });
                        }} class="h-4 w-4 accent-blue-600" />
                    Lock aspect ratio
                </label>
                {!settings.locked && <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Width and height can be adjusted independently. Scaling keeps their current ratio.</p>}
            </fieldset>

            <TabletSlider value={settings.scale} disabled={!tablet || (settings.locked && !ratio)} onChange={changeScale} />

            <fieldset disabled={!tablet || (settings.locked && !ratio)} class="control-group disabled:opacity-50">
                <legend class="control-legend">Exact dimensions</legend>
                <div class="dimension-grid">
                    <label class="min-w-0 text-sm">Width (mm)
                        <input type="number" min="0" max={tablet?.width} step="any" value={settings.width}
                            onInput={(event) => changeDimension("width", event.currentTarget.value)}
                            class="field-input mt-1 w-full" />
                    </label>
                    <label class="min-w-0 text-sm">Height (mm)
                        <input type="number" min="0" max={tablet?.height} step="any" value={settings.height}
                            onInput={(event) => changeDimension("height", event.currentTarget.value)}
                            class="field-input mt-1 w-full" />
                    </label>
                </div>
            </fieldset>

            {error && <p role="alert" class="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
            {tablet && !error && <TabletResultDisplay area={area} tablet={tablet} />}
            {!tablet && <p class="text-center text-sm text-gray-600 dark:text-gray-400">Choose a tablet to see your dimensions and preview.</p>}

            <details class="text-sm text-gray-600 dark:text-gray-400">
                <summary class="cursor-pointer font-medium text-gray-800 dark:text-gray-200">About ratios and mapping</summary>
                <p class="mt-2">These are physical tablet dimensions. 4:3 is the default shape, not a universal best setting. Choose the ratio that suits your driver mapping and preference.</p>
                <p class="mt-2">Your mapped screen or window, driver settings, and osu! settings determine how the area feels. The preview does not represent the game playfield or change your driver settings.</p>
            </details>
        </div>
    );
}
