# osu!tableno

A lightweight, browser-based tablet area calculator for osu!.

**[Open the calculator](https://providedtimmy.github.io/osu-tableno/)**

## Usage

1. Select your tablet brand and model.
2. Adjust the percentage slider.
3. Use the resulting width and height as a starting point in your tablet driver.

Includes tablet presets from Wacom, Huion, Gaomon, and XP-Pen. Calculations run
locally in your browser; no account or installation is required.

## Calculation assumptions

The calculator uses the original project's fixed 4:3 target ratio and 512 × 384
osu! playfield units. The percentage scales tablet dimensions, not physical
surface area. The displayed `px/mm` values use playfield units, not your monitor's
physical pixel resolution.

Results depend on your tablet-driver and osu! mapping settings. They are a
starting point for experimentation, not a universal optimal area.

## Development

Requires Node.js 22.12 or newer. The deployment workflow uses Node.js 24.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Built with Preact, TypeScript, Tailwind CSS, and Vite. The production build is in
`dist/`. Pull requests run the type check and build; pushes to `main` automatically
deploy to GitHub Pages. For a fork, select **GitHub Actions** under
**Settings → Pages → Build and deployment → Source**.

Tablet presets are in `utils/constants/tablets.ts`; calculations are in
`utils/calculations.ts`.

## Credits and references

Based on [kawarbon/osu-tableno](https://github.com/kawarbon/osu-tableno).

- [osu! playfield documentation](https://osu.ppy.sh/wiki/en/Client/Playfield)
- [Tablet area ratio discussion](https://osu.ppy.sh/community/forums/topics/1246260?n=1)
- [OpenTabletDriver](https://github.com/OpenTabletDriver/OpenTabletDriver)
