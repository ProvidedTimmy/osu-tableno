# osu!tableno

A simple tablet area calculator for osu!

See also:

- [Client / Playfield](https://osu.ppy.sh/wiki/en/Client/Playfield)

- [Research on perfect Tablet Area Ratio](https://osu.ppy.sh/community/forums/topics/1246260?n=1)

## Usage

1. Select your tablet brand and model
2. Adjust percentage slider to find your optimal tablet area

Tested with [OpenTabletDriver](https://github.com/OpenTabletDriver/OpenTabletDriver) using:

- ### Hardware

  - 🖥️ 1920x1080 (16:9)

  - 🎮🪟 1440x1080 (4:3)

  - 🎨 One by Wacom (CTL-472)

- ### Software (osu!Stable)

  - ✅ Fullscreen mode

  - ✅ Render at native resolution

  - ✅ Map absolute raw input to the osu! window


## GitHub Pages

The Pages build runs entirely in the browser, using the existing Preact components,
tablet list, and calculations. No Deno server or external API is needed.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push these changes to `main`, or run **Deploy to GitHub Pages** from the
   **Actions** tab after the workflow is on `main`.
4. Wait for the deployment job to finish. The site will be available at
   <https://providedtimmy.github.io/osu-tableno/>.

Pull requests run the type check and production build without publishing.
Only `main` can deploy. Subsequent pushes to `main` update the site automatically.
The workflow uses GitHub's built-in token; no personal access token is needed.

### Local development and production preview

Requires Node.js 22.12+ (Node.js 24 LTS recommended).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

`dist/` contains the complete static site. Asset URLs are relative so they work
under the `/osu-tableno/` repository path or on a custom domain. Fonts use a local
system fallback; the Pages build does not require a font or icon CDN.

The original Deno/Fresh entry points are retained for local Deno use (`deno task
start`), but the automated deployment now targets GitHub Pages.

### Calculation assumptions

This retains the original fixed 4:3 calculation and 512 × 384 playfield-unit
scaling. The percentage scales tablet dimensions; it is not the percentage of
physical surface area. The result is a starting point, not a universal optimal
area or a calculation based on your monitor resolution.

Original project: <https://github.com/kawarbon/osu-tableno>.
