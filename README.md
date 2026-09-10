# osu!tableno

A lightweight, browser-based tablet area calculator for osu!.

**[Open the calculator](https://providedtimmy.github.io/osu-tableno/)**

## Usage

1. Select your tablet brand and model.
2. Keep the default 4:3 ratio, choose 16:9, or enter a custom width-to-height ratio.
3. Adjust **Area scale**, or enter exact width and height in millimeters.
4. Use **Copy width** and **Copy height** to transfer the values into your tablet driver.
5. Use **Share config** to copy a link that restores the selected tablet, dimensions,
   ratio, and lock state. Links contain configuration only.

The last valid configuration is remembered locally in this browser. A shared
link takes precedence over saved settings. Editing a shared configuration clears
its old URL fragment so reloading restores your latest valid edits. **Reset**
clears the remembered configuration and returns to the initial controls.

If browser storage is blocked, the calculator still works. If clipboard access
is blocked, selected text is shown for manual copying. Invalid configurations
are not saved or shared.

**Lock aspect ratio** keeps width and height linked. Turn it off to edit them
independently. The preview shows the selected area inside the full tablet;
centering is illustrative and does not set the position in your driver.

Includes tablet presets from Wacom, Huion, Gaomon, and XP-Pen. Calculations run
locally in your browser; no account or installation is required.

## Calculation assumptions

100% means the largest rectangle that fits inside the tablet at the current
ratio. 50% halves both dimensions, producing one quarter of that rectangle's
surface area. Scaling an unlocked area preserves its current shape.

Custom ratio values can range from 0.1 to 100 on each side; portrait ratios are
supported. Dimensions must be positive and fit inside the tablet. Oversized or
invalid inputs show an explanation instead of a result.

These are physical tablet dimensions, not screen-pixel sensitivity values. Your
mapped screen or window, driver settings, and osu! settings determine how the
area feels. 4:3 is a default shape, not a universal optimal ratio. No driver
settings are changed by the calculator.

## Development

Requires Node.js 22.12 or newer. The deployment workflow uses Node.js 24.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Built with Preact, TypeScript, Tailwind CSS, and Vite. The production build is in
`dist/`. Pull requests run calculation tests, the type check, and build; pushes to `main` automatically
deploy to GitHub Pages. For a fork, select **GitHub Actions** under
**Settings → Pages → Build and deployment → Source**.

Tablet presets are in `utils/constants/tablets.ts`; calculations are in
`utils/calculations.ts`. Preset dimensions match the pinned
[OpenTabletDriver configuration snapshot](https://github.com/OpenTabletDriver/OpenTabletDriver/tree/1cad28e3f6bc1616d4f01fbea127b105cddc0bbe/OpenTabletDriver.Configurations/Configurations).
The dataset uses exact model names because similarly named Wacom models can
have different dimensions. These are the dimensions used by OpenTabletDriver,
which may differ from rounded dimensions in product marketing.

## Credits and references

Based on [kawarbon/osu-tableno](https://github.com/kawarbon/osu-tableno).

- [osu! playfield documentation](https://osu.ppy.sh/wiki/en/Client/Playfield)
- [Tablet area ratio discussion](https://osu.ppy.sh/community/forums/topics/1246260?n=1)
- [OpenTabletDriver](https://github.com/OpenTabletDriver/OpenTabletDriver)
