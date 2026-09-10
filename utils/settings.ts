import { getMaximumArea } from "./calculations.ts";
import { TABLETS } from "./constants/tablets.ts";

export type Preset = "4:3" | "16:9" | "custom";
export interface Settings {
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

export const STORAGE_KEY = "osu-tableno.config.v1";
export const DEFAULT_SETTINGS: Settings = {
    brand: "", model: "", preset: "4:3", ratioWidth: "4", ratioHeight: "3",
    locked: true, scale: "50", width: "", height: "",
};
export const positive = (value: number): boolean => Number.isFinite(value) && value > 0;
export const textNumber = (value: number): string => Number(value.toFixed(8)).toString();

export function selectedRatio(settings: Settings): number | null {
    if (settings.preset === "4:3") return 4 / 3;
    if (settings.preset === "16:9") return 16 / 9;
    const width = Number(settings.ratioWidth);
    const height = Number(settings.ratioHeight);
    if (![width, height].every((value) => Number.isFinite(value) && value >= 0.1 && value <= 100)) return null;
    return width / height;
}

function normalizeSettings(settings: Settings): Settings | null {
    if (!Object.hasOwn(TABLETS, settings.brand) || !Object.hasOwn(TABLETS[settings.brand], settings.model)) return null;
    if (!["4:3", "16:9", "custom"].includes(settings.preset)) return null;
    const tablet = TABLETS[settings.brand][settings.model];
    const width = Number(settings.width);
    const height = Number(settings.height);
    const scale = Number(settings.scale);
    if (![width, height, scale].every(positive) || scale > 100 + 1e-7) return null;
    if (width > tablet.width + 1e-7 || height > tablet.height + 1e-7) return null;
    const ratio = selectedRatio(settings);
    if (settings.locked && (!ratio || Math.abs(width - height * ratio) > Math.max(width, height * ratio) * 1e-6 + 1e-7)) return null;
    const effectiveRatio = settings.locked ? ratio : width / height;
    if (!effectiveRatio || !positive(effectiveRatio)) return null;
    const maximum = getMaximumArea(tablet, effectiveRatio);
    const actualScale = Math.min(100, Math.max(width / maximum.width, height / maximum.height) * 100);
    if (!positive(actualScale)) return null;
    const validTerms = [Number(settings.ratioWidth), Number(settings.ratioHeight)].every((value) => Number.isFinite(value) && value >= 0.1 && value <= 100);
    return {
        ...settings,
        width: String(width), height: String(height), scale: String(actualScale),
        ratioWidth: validTerms ? String(Number(settings.ratioWidth)) : "4",
        ratioHeight: validTerms ? String(Number(settings.ratioHeight)) : "3",
    };
}

export function encodeConfig(settings: Settings): string | null {
    const valid = normalizeSettings(settings);
    if (!valid) return null;
    const params = new URLSearchParams({
        v: "1", brand: valid.brand, model: valid.model,
        w: valid.width, h: valid.height, p: valid.preset,
        rw: valid.ratioWidth, rh: valid.ratioHeight,
        lock: valid.locked ? "1" : "0",
    });
    return params.toString();
}

export function decodeConfig(value: string): Settings | null {
    if (!value || value.length > 2048) return null;
    const params = new URLSearchParams(value.replace(/^#/, ""));
    const keys = ["v", "brand", "model", "w", "h", "p", "rw", "rh", "lock"];
    if (keys.some((key) => params.getAll(key).length !== 1)) return null;
    if (params.get("v") !== "1" || !["0", "1"].includes(params.get("lock")!)) return null;
    const settings: Settings = {
        brand: params.get("brand")!, model: params.get("model")!,
        width: params.get("w")!, height: params.get("h")!,
        preset: params.get("p")! as Preset,
        ratioWidth: params.get("rw")!, ratioHeight: params.get("rh")!,
        locked: params.get("lock") === "1", scale: "100",
    };
    return normalizeSettings(settings);
}

export function loadSettings(): { settings: Settings; notice: string } {
    if (window.location.hash) {
        const shared = decodeConfig(window.location.hash);
        return shared ? { settings: shared, notice: "Shared configuration loaded." } : {
            settings: { ...DEFAULT_SETTINGS }, notice: "This shared configuration is invalid or no longer fits its tablet. Choose a tablet to start.",
        };
    }
    try {
        const saved = decodeConfig(window.localStorage.getItem(STORAGE_KEY) || "");
        if (saved) return { settings: saved, notice: "" };
    } catch {
        // Storage may be unavailable in private or restricted browsers.
    }
    return { settings: { ...DEFAULT_SETTINGS }, notice: "" };
}
