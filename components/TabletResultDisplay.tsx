import type { JSX } from "preact";
import type { TabletDimensions } from "../utils/types/tablet.ts";

export function formatDimension(value: number): string {
    return Number(value.toPrecision(6)).toString();
}

export function TabletResultDisplay({ area, tablet }: {
    area: TabletDimensions;
    tablet: TabletDimensions;
}): JSX.Element {
    return (
        <section class="rounded-lg border border-blue-200 bg-blue-50 p-[12px] dark:border-blue-900 dark:bg-blue-950/40">
            <div role="status" aria-live="polite" class="text-center">
                <h2 class="text-sm font-medium text-blue-800 dark:text-blue-200">Your tablet area</h2>
                <p class="mt-1 text-2xl font-semibold tabular-nums text-blue-950 dark:text-blue-100 break-words">
                    {formatDimension(area.width)} × {formatDimension(area.height)} <span class="text-base font-normal">mm</span>
                </p>
                <p class="mt-1 text-sm text-blue-800 dark:text-blue-200">Width × height · Ratio {formatDimension(area.width / area.height)}:1</p>
            </div>
            <figure class="mt-5">
                <svg
                    role="img"
                    aria-label={`Selected area ${formatDimension(area.width)} by ${formatDimension(area.height)} millimeters inside a ${tablet.width} by ${tablet.height} millimeter tablet`}
                    viewBox={`0 0 ${tablet.width} ${tablet.height}`}
                    class="mx-auto block w-full max-h-44 overflow-visible"
                >
                    <rect x="0" y="0" width={tablet.width} height={tablet.height} class="fill-white stroke-gray-400 dark:fill-gray-900 dark:stroke-gray-500" stroke-width="1" vector-effect="non-scaling-stroke" />
                    <rect
                        x={(tablet.width - area.width) / 2}
                        y={(tablet.height - area.height) / 2}
                        width={area.width}
                        height={area.height}
                        class="fill-blue-200 stroke-blue-600 dark:fill-blue-900 dark:stroke-blue-400"
                        stroke-width="2"
                        vector-effect="non-scaling-stroke"
                    />
                </svg>
                <figcaption class="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    Full tablet: {tablet.width} × {tablet.height} mm.<br />
                    Area shown centered for illustration; position it in your driver.
                </figcaption>
            </figure>
        </section>
    );
}
