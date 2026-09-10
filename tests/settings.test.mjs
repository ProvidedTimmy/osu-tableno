import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SETTINGS, encodeConfig, decodeConfig } from '../utils/settings.ts';
import { TABLETS } from '../utils/constants/tablets.ts';

const config = { ...DEFAULT_SETTINGS, brand: 'wacom', model: 'CTL-4100', width: '60', height: '45', scale: '47.36842105' };

test('shared configurations preserve exact dimensions, ratio and lock state', () => {
    for (const current of [
        config,
        { ...config, preset: '16:9', width: '80', height: '45', scale: '52.63157895' },
        { ...config, preset: 'custom', ratioWidth: '9', ratioHeight: '16', width: '45', height: '80', scale: '84.21052632' },
        { ...config, locked: false, width: '72.125', height: '41.75', scale: '50' },
    ]) {
        const encoded = encodeConfig(current);
        assert(encoded);
        const restored = decodeConfig('#' + encoded);
        assert(restored);
        for (const key of ['brand', 'model', 'width', 'height', 'preset', 'locked', 'ratioWidth', 'ratioHeight']) {
            assert.equal(restored[key], current[key]);
        }
        assert(Number(restored.scale) > 0 && Number(restored.scale) <= 100);
        assert.equal(encodeConfig(restored), encoded);
    }
});

test('links contain only configuration fields', () => {
    const params = new URLSearchParams(encodeConfig(config));
    assert.deepEqual([...params.keys()], ['v', 'brand', 'model', 'w', 'h', 'p', 'rw', 'rh', 'lock']);
    params.set('name', '<script>alert(1)</script>');
    assert(!encodeConfig(decodeConfig(params.toString())).includes('script'));
});

test('invalid or incompatible links are rejected', () => {
    for (const [key, value] of [
        ['v', '2'], ['brand', '__proto__'], ['model', 'constructor'], ['model', 'missing'],
        ['w', 'NaN'], ['w', 'Infinity'], ['w', '-1'], ['w', '0'], ['w', '10000'],
        ['h', '95.1'], ['p', 'unknown'], ['lock', 'yes'], ['h', '44'],
    ]) {
        const params = new URLSearchParams(encodeConfig(config));
        params.set(key, value);
        assert.equal(decodeConfig(params.toString()), null, `${key}=${value}`);
    }
    const duplicated = encodeConfig(config) + '&w=60';
    assert.equal(decodeConfig(duplicated), null);
    assert.equal(decodeConfig('a'.repeat(2049)), null);
    assert.equal(decodeConfig(''), null);
    assert.equal(encodeConfig({ ...config, scale: '0' }), null);
    assert.equal(encodeConfig({ ...config, scale: '101' }), null);
    assert.equal(encodeConfig({ ...DEFAULT_SETTINGS }), null);
});

test('verified tablet dimensions distinguish models that used to share a generic name', () => {
    assert.deepEqual(TABLETS.wacom['CTL-4100'], { width: 152, height: 95 });
    assert.notDeepEqual(TABLETS.wacom['CTE-460'], TABLETS.wacom['CTL-460']);
    assert.deepEqual(TABLETS['xp-pen'].G540, { width: 228.6, height: 146.05 });
});
