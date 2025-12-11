# QR Sticker Layout Library

Framework-agnostic utilities to define, persist, preview, and export QR-based sticker/badge layouts. Works with React, Vue, Svelte, Next.js, Nuxt, or any setup that can run browser-compatible JS.

## Install (as package)

```bash
npm install qr-code
```

```ts
import {
  LayoutBuilder,
  LayoutService,
  MemoryLayoutStore,
  StickerPrinter
} from "qr-code";
```

Your bundler should handle ES modules. If you target older environments, add the appropriate polyfills for `fetch`, `FileReader`, and `canvas`.

## Core Concepts

- **Layout**: JSON-safe object describing sticker size, background, and positioned elements (`text`, `qr`, `image`). See `StickerLayout` in `src/layout/schema.ts`.
- **Builder**: Fluent helper to assemble layouts in code (`LayoutBuilder`).
- **Store**: Abstraction for saving/fetching layouts. Provided: `MemoryLayoutStore` (in-memory) and `LocalStorageLayoutStore`.
- **Service**: High-level API combining a store with rendering/export (`LayoutService`).
- **Printer**: Low-level renderer/exporter (`StickerPrinter`) if you want direct control.

## End-to-End Flow (what the UI should enable)

1) Show detected keys from sample data (e.g., `{ name, age, uuid }`) so the user can choose which to place.
2) Let the user pick unit (`mm | px | cm | in`) plus width and height.
3) Provide a default QR element; user selects which key or custom text feeds it and drags it to position/size.
4) Allow placing each key as text (content `{{key}}`) with styling controls.
5) On **Save**, serialize the `StickerLayout` JSON and send it to your API/DB.
6) In another component, load that JSON, pass real data, render preview, and expose Print Preview + Print/Download (PDF, PNG, SVG).

## Quick Start (browser)

```ts
import {
  LayoutBuilder,
  LayoutService,
  MemoryLayoutStore
} from "qr-code";

// 1) Create a layout
const layout = new LayoutBuilder("badge-1", "Conference Badge", 100, 60, "mm")
  .setBackground("#f8f9fa")
  .addText("title", "DEV CON 2025", 0, 4, 100, 10, {
    fontSize: 16, fontWeight: "bold", textAlign: "center", color: "#fff", backgroundColor: "#333"
  })
  .addField("name", "name", "Name", 5, 25, 90, 10, { fontSize: 14, color: "#333" })
  .addQR("qr", "uuid", 70, 25, 25, 25)
  .build();

// 2) Save it
const store = new MemoryLayoutStore(); // or new LocalStorageLayoutStore()
const service = new LayoutService(store);
await service.saveLayout(layout);

// 3) Render preview to a canvas
const data = { name: "Arun", uuid: "https://example.com/u/arun" };
const canvas = document.getElementById("preview") as HTMLCanvasElement;
await service.renderPreview("badge-1", data, canvas);

// 4) Export PDF / PNG / SVG
const pdf = await service.exportPdf("badge-1", [data]);
pdf.save("badge.pdf");

const pngUrl = await service.exportImage("badge-1", data, { format: "png" });
// use pngUrl in an <img> or download link

const svgMarkup = await service.exportSvg("badge-1", data);
// insert into DOM or save as file
```

## UI Checklist (Layout Creator component)

- Show dynamic field list from sample data keys; allow selecting which keys to place.
- Controls for unit + width + height.
- Canvas/artboard preview where elements can be positioned (drag/resize) and styled (font size/color/weight, alignment).
- Default QR element already present; user can pick which key feeds it and move/resize it.
- “Save layout” button that outputs the `StickerLayout` JSON to your backend API.

## Using in Component Frameworks

- **React/Vue/Svelte**: Manage layout and data in state; pass a ref'd `<canvas>` to `renderPreview`. Trigger exports on button clicks.
- **Next.js/Nuxt**: Call rendering/export only on the client (guard with `useEffect`/onMounted). Store layouts server-side via a custom `LayoutStore` implementation (see below).

## Creating Layouts Visually

You can build a drag-and-drop UI that outputs the fields required by `StickerLayout`:
- Sticker size (`width`, `height`, `unit`)
- Background (`backgroundColor`, optional `backgroundImage`)
- Elements array with `type`, `id`, `x`, `y`, `w`, `h`, `content`, and optional `style`

Persist that JSON through `LayoutService.saveLayout`.

## Custom `LayoutStore`

Implement persistence for your backend:

```ts
class ApiLayoutStore {
  async save(layout) { await fetch("/api/layouts", { method: "POST", body: JSON.stringify(layout) }); }
  async get(idOrName) { const res = await fetch(`/api/layouts/${idOrName}`); return res.ok ? res.json() : undefined; }
  async list() { const res = await fetch("/api/layouts"); return res.json(); }
  async remove(idOrName) { await fetch(`/api/layouts/${idOrName}`, { method: "DELETE" }); }
}
```

Then `new LayoutService(new ApiLayoutStore())`.

## Low-Level `StickerPrinter`

If you do not want a store/service:

```ts
import { StickerPrinter } from "./src";
const printer = new StickerPrinter();
await printer.renderToCanvas(layout, data, canvas);
const png = await printer.renderToDataURL(layout, data, { format: "png" });
const pdf = await printer.exportToPDF(layout, [data]);
const svg = await printer.exportToSVG(layout, data);
```

## Dynamic Fields

Use `{{fieldName}}` in `content`. The renderer replaces them with the provided data object:
- Text: `"Name: {{name}}"`
- QR: `content: "{{qr_payload}}"` turns into a QR code.

## Export Formats

- **Preview**: Canvas via `renderPreview`/`renderToCanvas`.
- **PDF**: `exportPdf(layoutId, [data...])`.
- **Images**: `exportImage`/`exportImages` → data URLs (`png|jpeg|jpg|webp`).
- **SVG**: `exportSvg` → markup string.

## Styling

`ElementStyle` supports `fontFamily`, `fontSize`, `fontWeight`, `textAlign`, `color`, and `backgroundColor` (fills bounding box when using canvas). Add more as needed.

## Notes and Limits

- For server-side rendering, supply your own `canvas` instance (e.g., via `node-canvas`) and ensure `fetch`/`FileReader` polyfills exist before calling image/SVG helpers.
- External images must be resolvable to data URLs (CORS applies in browsers).
- Units: `mm | px | cm | in`. Canvas uses 96 dpi conversion; PDF and SVG use layout units directly.

## Demo

See `index.html` and `src/demo_entry.ts` for a runnable Vite-style browser demo with preview plus PDF/PNG downloads.

## Build & Publish (npm package)

1) Install deps: `npm install`
2) Build: `npm run build` (outputs `dist/` with JS + d.ts)
3) Test locally in another project: `npm pack` → installs as `npm install ../path/qr-code-1.0.0.tgz`
4) Publish: `npm login` → `npm publish --access public`

If you change the code, bump version (`npm version patch|minor|major`) before publishing.
