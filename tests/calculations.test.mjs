import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateArea, getMaximumArea } from '../utils/calculations.ts';
import { TABLETS } from '../utils/constants/tablets.ts';

test('G540 fits a 4:3 area without stretching at 100%', () => {
    assert.deepEqual(calculateArea(TABLETS['xp-pen'].G540, 100), { width: 127, height: 95.25 });
});

test('every preset stays within its tablet and preserves the requested ratio', () => {
    for (const models of Object.values(TABLETS)) {
        for (const tablet of Object.values(models)) {
            for (const ratio of [4 / 3, 16 / 9, 21 / 9, 9 / 16, 1, 0.001, 1000]) {
                for (const percent of [0.01, 1, 50, 99.9, 100]) {
                    const area = calculateArea(tablet, percent, ratio);
                    assert(area.width > 0 && area.width <= tablet.width + 1e-9);
                    assert(area.height > 0 && area.height <= tablet.height + 1e-9);
                    assert(Math.abs(area.width / area.height - ratio) < 1e-9);
                }
            }
        }
    }
});

test('100% reaches an edge and 50% halves both dimensions', () => {
    const tablet = TABLETS.wacom['CTL-4100'];
    for (const ratio of [4 / 3, 16 / 9, 9 / 16]) {
        const full = getMaximumArea(tablet, ratio);
        const half = calculateArea(tablet, 50, ratio);
        assert(Math.abs(full.width - tablet.width) < 1e-9 || Math.abs(full.height - tablet.height) < 1e-9);
        assert(Math.abs(half.width - full.width / 2) < 1e-9);
        assert(Math.abs(half.height - full.height / 2) < 1e-9);
    }
});

test('invalid dimensions, scales and ratios are rejected', () => {
    const tablet = TABLETS.wacom['CTL-4100'];
    for (const value of [0, -1, NaN, Infinity, -Infinity]) {
        assert.throws(() => getMaximumArea({ width: value, height: 100 }, 4 / 3), RangeError);
        assert.throws(() => getMaximumArea({ width: 100, height: value }, 4 / 3), RangeError);
        assert.throws(() => getMaximumArea(tablet, value), RangeError);
        assert.throws(() => calculateArea(tablet, value), RangeError);
    }
    assert.throws(() => calculateArea(tablet, 101), RangeError);
});
