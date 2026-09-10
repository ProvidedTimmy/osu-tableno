import type { TabletDimensions } from "./types/tablet.ts";

export function getMaximumArea(
    tablet: TabletDimensions,
    ratio: number,
): TabletDimensions {
    if (![tablet.width, tablet.height, ratio].every((value) => Number.isFinite(value) && value > 0)) {
        throw new RangeError("Tablet dimensions and aspect ratio must be positive finite numbers.");
    }
    const width = Math.min(tablet.width, tablet.height * ratio);
    const height = width / ratio;
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        throw new RangeError("This aspect ratio cannot produce a usable area.");
    }
    return { width, height };
}

export function calculateArea(
    tablet: TabletDimensions,
    percentage: number,
    ratio = 4 / 3,
): TabletDimensions {
    if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
        throw new RangeError("Area scale must be greater than 0 and at most 100%.");
    }
    const maximum = getMaximumArea(tablet, ratio);
    return {
        width: maximum.width * percentage / 100,
        height: maximum.height * percentage / 100,
    };
}
