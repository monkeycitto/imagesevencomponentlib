# imageseven

Hand someone the GitHub link to this file. That is the whole brief.

The site they build loads the library from that same repo:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-USER/YOUR-REPO@main/preview/library.css">
<script>
  try {
    var t = localStorage.getItem("is-theme");
    if (!t && matchMedia("(prefers-color-scheme: dark)").matches) t = "dark";
    if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
  } catch (e) {}
</script>
```

`library.css` is the system (it includes `tokens.css`). `docs.css` is only the preview. The visual catalogue is `preview/index.html`.

Set `--font-slab` to Museo Slab, `--font-sans` to Dupla, and `--font-email` to Aptos. Dupla and Museo Slab are licensed and are not in this repo. Until they are installed, the preview stands in with Roboto Slab and Outfit. Keep `font-kerning: normal`. Tracking in the tables is the letter-spacing you set.

A page is editorial (`.ed-*`) or interface (`.ui-*`). Do not mix them on one line. No commerce: no catalogue, cart, checkout, or price-as-product. A named engagement is allowed.

## Rules

- Wordmark is the horizontal ultramarine logo, `preview/logo.png`. On an ultramarine bar, render it white. Australian spelling.
- Marketing buttons are lowercase, weight 800: `.btn-brand`, `.btn-inverse`. Product buttons are sentence case: `.btn`.
- One primary action per view. Controls are 44 tall. Dense controls (pager, chips, `.btn-sm`) may be 32, and they are never the only way to the primary action.
- Citrine and chartreuse are not small text on white. White on ultramarine is for 16px semibold and larger; smaller white type uses `--brand-deep`.
- Space is a 4-point grid. If a value is not in the scale, it does not ship. The live site pads buttons 10×20; use 12×20.

## Colour

The consistent use of colour is an important element of the imageseven visual identity. The following colours are approved for use when producing imageseven content. These colours are the only approved colours that can be used when reproducing the logo and logotype.

The primary palette should be used for all formal communications. The secondary palette can be used in imageseven marketing and promotional activities.

Each colour has tints at 100, 75, 50, 25, and 10, mixed with white.

### Primary

| Name | Token | Hex | RGB | Pantone |
| --- | --- | --- | --- | --- |
| ultramarine | `--ultramarine` | `#0085CA` | 0, 133, 202 | Process Blue C |
| granite | `--granite` | `#333F48` | 51, 63, 72 | 432 C |

### Secondary

| Name | Token | Hex | RGB | Pantone |
| --- | --- | --- | --- | --- |
| turquoise | `--turquoise` | `#009CA6` | 0, 156, 166 | 320 C |
| chartreuse | `--chartreuse` | `#D0DF00` | 208, 223, 0 | 389 C |
| citrine | `--citrine` | `#FFD700` | 255, 215, 0 | Yellow 012 C |
| magenta | `--magenta` | `#D00070` | 208, 0, 112 | 226 C |
| turmeric | `--turmeric` | `#FE5000` | 254, 80, 0 | Orange 021 C |
| amethyst | `--amethyst` | `#9B26B6` | 155, 38, 182 | 2592 C |

`--brand` is ultramarine. `--gold` is citrine. `--slate-fixed` is granite. These names do not flip in dark mode.

Interface surfaces and status colours sit outside the logo palette. They flip with the theme.

| Token | Light | Dark |
| --- | --- | --- |
| `--canvas` | `#FFFFFF` | `#14191E` |
| `--surface` | `#FFFFFF` | `#1C232A` |
| `--surface-muted` | `#F1F1F1` | `#242C34` |
| `--ink` / `--heading` | `#333333` / `#333F48` | `#F3F6F8` |
| `--slate` / `--muted` | `#333F48` / `#5C6B76` | `#D5DDE3` / `#9AA7B2` |
| `--line` / `--line-strong` | `#E3E7EB` / `#C9D1D8` | white 10% / 18% |
| `--action` / `--on-action` | `#0085CA` / `#FFFFFF` | `#33BBFF` / `#06202C` |
| `--link` | `#0085CA` | `#7DCEFF` |
| `--hero` | `#32383F` | `#1A2026` |
| `--info-bg` | `#E7F4FB` | `#143041` |
| `--success` / bg | `#0F7A5A` / `#E7F6F0` | `#3DBE8B` / `#10281F` |
| `--warning` / bg | `#8A6500` / `#FFF6CC` | `#FFD76A` / `#2C250F` |
| `--danger` / bg | `#B42318` / `#FDECEA` | `#FF8D84` / `#3A1714` |

The canvas has a 32px graph-paper grid in brand blue at low opacity. Components sit on `--surface`.

## Type

Museo Slab, in its various weights and faces, is used for major headings and titles in all communications.

Dupla, in its various weights and faces, is used for headings and body copy in all communications.

Aptos is for email correspondence, and for communications where Dupla and Museo Slab are unavailable. Aptos 11pt is the typeface for email correspondence.

| Family | Token | Role | Weights, each with italic |
| --- | --- | --- | --- |
| Museo Slab | `--font-slab` | Titles and major headings | 100, 300, 500, 700, 900, 1000 |
| Dupla | `--font-sans` | Headings and body copy | Thin, Light, Book, Regular, DemiBold, Bold, Heavy, Black |
| Aptos | `--font-email` | Email only | Light, Regular, SemiBold, Bold, ExtraBold, Black |

On screen, titles and major headings use Museo Slab. Headings and body use Dupla. First display line may be weight 500; the claim is 800 and `--brand`.

| Class | Weight | Size / leading | Tracking |
| --- | --- | --- | --- |
| `.ed-display` | 800 | 64 / 64 | −0.64 |
| `.ed-title-lg` | 700 | 44 / 48 | −0.48 |
| `.ed-title` | 600 | 40 / 44 | −0.40 |
| `.ed-title-s` | 700 | 24 / 30 | −0.24 |
| `.ed-lead` | 500 | 24 / 36 | −0.20 |
| `.ed-body` / `.ed-strong` | 400 / 700 | 18 / 27 | 0 |
| `.ed-caption` | 600 | 13 / 18 | −0.08 |
| `.ed-stat` | 700 | 80 / 80 | −0.80 |
| `.ed-accent` | 700 | 72 / 72 | 0 |

`.ed-accent` is one word inside a headline. Body measure 66ch. Title to body 12. Display to lede 16. Paragraphs 16.

Interface. Dupla only. Leave the positive tracking as written. KPI metric is 700, 28/34, tracking +0.36 (`.kpi .metric`). Email is Aptos at 11pt, `--font-email`.

| Class | Weight | Size / leading | Tracking |
| --- | --- | --- | --- |
| `.ui-large-title` | 400 | 34 / 41 | +0.37 |
| `.ui-title-1` | 400 | 28 / 34 | +0.36 |
| `.ui-title-2` | 400 | 22 / 28 | +0.35 |
| `.ui-title-3` | 400 | 20 / 25 | +0.38 |
| `.ui-headline` | 600 | 17 / 22 | −0.41 |
| `.ui-body` | 400 | 17 / 22 | −0.41 |
| `.ui-callout` | 400 | 16 / 21 | −0.32 |
| `.ui-subhead` | 400 | 15 / 20 | −0.24 |
| `.ui-footnote` | 400 | 13 / 18 | −0.08 |
| `.ui-caption-1` | 400 | 12 / 16 | 0 |
| `.ui-caption-2` | 400 | 11 / 13 | +0.07 |

## Space

`2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128`

| Job | Value |
| --- | --- |
| Icon to label, tight stack | 8 |
| Title to body | 12 |
| Default stack, paragraphs | 16 |
| Card, related group, grid gutter | 24 |
| Break inside a page | 32, then 40 |
| Brand panel | 48 |
| New section | 64 |
| Hero | 24 inside the frame, 64 before the headline |
| Button | 12 × 20 |
| Field, nav item, table cell | 12 × 16 |
| Page margin | 24, or 40 from tablet up |

Layout helpers: `.stack-8` `.stack-12` `.stack-16` `.stack-24` `.stack-32` `.stack-40` `.cluster` `.grid-2` `.grid-3` `.grid-4` `.split`. Page is 12 columns, `--gutter` 24, `--page` 1160.

## Shape

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sq` | 0 | Gold labels |
| `--radius-10` | 10 | Buttons, fields, nav, cards, menus |
| `--radius-16` | 16 | Sheets, dialogs, auth |
| `--radius-30` | 30 | Brand panels, newsletter, call to action |
| `--radius-full` | 999 | Switches, pills, chips |

Shadow 1 resting, 2 menus and toasts, 3 dialogs. Focus: 2px `--brand-bright`, 3px outside. Motion 160ms. Honour reduced motion.

## Components

| Piece | Classes |
| --- | --- |
| Actions | `.btn` `.btn-brand` `.btn-inverse` `.btn-ghost` `.btn-outline` `.btn-danger` `.btn-sm` `.badge` `.badge-gold` |
| Marketing | `.m-nav` `.hero` `.card` `.card-mist` `.card-brand` `.steps` `.quote` `.people` `.price` `.site-footer` |
| Product | `.app` `.kpi` `.data` `.tabs` `.field` `.alert` `.modal` `.cmd` |
| Dates | `.date` `.date-trigger` `.date-pop` `.date-panel` `.cal` |
| Choices | `.radio` `.radio-group` `.radio-card` `.radio-list` |
| App UI | `.feed` `.page-head` `.filter-bar` `.drawer` `.tree` `.drop` `.psteps` `.thread` |
| Status | `.badge-ok` `.badge-warn` `.badge-bad` — always with a word |

- Navbar is brand blue, radius 10, white type. Small screens use `.m-burger`.
- Hero is photography, or `--hero`. Display in brand, lead in white, one `.btn-brand`.
- `.card` padding 24. `.card-brand` copy is white at 18px bold. Its step numbers are white tiles with brand numerals.
- `.price` is an engagement (name, shape of work, three bullets, one button). `.price-mark` is the recommended card, with a gold label. Not a shop.
- Footer is `--slate-fixed`. Fields: `.lbl` 8 above a 44px control, padding 12×16. Error uses `.is-invalid` and `.err`.
- Command menu: `.cmd-modal` is 560 wide, `.cmd-menu` about 360. Rows are `.cmd-item` (add `.is-stack` for a second line). ⌘K or Ctrl K opens, arrows move, Enter selects, Escape closes. A selection toasts; it does not open a new page unless the action is navigation.
- Dates read day, month, year (`12 Oct 2026`). Weeks start Monday. `.date` with `data-date="single"`, `range`, `inline`, `month`, or `week`. Range presets: today, last 7 days, last 30 days, this month, last month, this quarter. Selected day is brand. A day inside a range uses `--info-bg`.
- Radios are `.radio` inside `.radio-group`. One name per group. Cards use `.radio-card`. A person list uses `.radio-list`. A disabled option stays in the group. An unanswered group uses `.is-invalid`.
- Drawers (`.drawer`), confirm and wide dialogs, notifications (`.note-item`), filters, trees, and uploads (`.drop`) are in the preview under Dates through Overlays. Compose pages from those. Do not invent a second visual language for a dashboard.
- Product charts are Chart.js: bar, bubble, doughnut, pie, line, mixed, polar area, radar, and scatter. Colour them with the secondary palette. Keep the default Chart.js motion (one second, ease out). Honour reduced motion.
- A dialog asks. A toast tells, in one line, and leaves.

Buttons that sell a conversation: “schedule a meeting”, “learn more”. Buttons that change a tool: “Save changes”, “New project”.
