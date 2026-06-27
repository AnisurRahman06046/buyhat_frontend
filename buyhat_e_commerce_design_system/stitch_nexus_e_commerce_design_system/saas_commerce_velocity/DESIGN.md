---
name: SaaS Commerce Velocity
colors:
  surface: '#faf8ff'
  surface-dim: '#dad9e1'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3fa'
  surface-container: '#eeedf4'
  surface-container-high: '#e9e7ef'
  surface-container-highest: '#e3e1e9'
  on-surface: '#1a1b21'
  on-surface-variant: '#444651'
  inverse-surface: '#2f3036'
  inverse-on-surface: '#f1f0f7'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4b1c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#6e2d00'
  on-tertiary-container: '#ff8f4f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#783200'
  background: '#faf8ff'
  on-background: '#1a1b21'
  surface-variant: '#e3e1e9'
typography:
  display-lg:
    fontFamily: manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  price-xl:
    fontFamily: manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system focuses on high-performance e-commerce, blending the reliability of enterprise SaaS with the conversion-driven urgency of modern retail. The aesthetic is **Corporate / Modern**, leaning heavily into a premium, card-based layout that prioritizes clarity, speed, and trust.

The target audience consists of professional buyers and savvy consumers who expect a friction-less checkout experience. The UI evokes a sense of "efficient luxury"—organized, responsive, and authoritative. Key visual drivers include generous whitespace to reduce cognitive load and a disciplined use of accent colors to guide the user's eye toward the "Buy" journey.

## Colors
The palette is engineered for high-intent navigation. 

- **Primary (Deep Blue):** Reserved for structural elements, navigation, and core branding to establish trust.
- **Secondary (Emerald Green):** Used exclusively for positive feedback, "In Stock" indicators, and successful transaction states.
- **CTA/Accent (Vibrant Orange):** High-visibility color reserved for primary conversion points (Add to Cart, Checkout). It must never be used for non-interactive elements.
- **Warning/Urgency (Red):** Used for "Low Stock" alerts, flash sale countdowns, and destructive actions.
- **Neutrals:** The background uses a cool-toned light gray to make white cards pop, while the Dark Slate provides AAA-rated contrast for body copy.

## Typography
The system uses a dual-font approach to balance character with utility. 

**Manrope** is used for headlines and pricing to provide a modern, geometric feel that remains highly readable. **Inter** handles all body and UI text, ensuring maximum clarity for product descriptions and tabular data. **JetBrains Mono** is introduced sparingly for labels (e.g., SKU numbers, metadata, or technical specs) to reinforce the precise, SaaS-grade nature of the platform.

Price displays use `price-xl` with semi-bold weights to ensure they are the second highest element in the visual hierarchy after the product name.

## Layout & Spacing
The design system operates on a strict **8pt grid**. All margins, paddings, and height increments must be multiples of 8.

- **Grid:** A 12-column fluid grid is used for desktop (breakpoint: 1024px+). 
- **Gutter:** 24px gutters ensure breathing room between product cards.
- **Card Spacing:** Product grids should use the `md` (24px) spacing unit for both vertical and horizontal gaps.
- **Mobile:** Transition to a 2-column grid for product listings with 16px side margins. Large display typography scales down to `display-lg-mobile`.

## Elevation & Depth
This design system utilizes **Tonal Layers** combined with **Ambient Shadows** to create a premium feel. 

- **Surface (Level 0):** The main background (`#F8FAFC`).
- **Cards (Level 1):** White background (`#FFFFFF`) with a 1px border of `#E2E8F0` and a very soft shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Interactions (Level 2):** On hover, cards lift slightly (0px 8px 20px rgba(15, 23, 42, 0.08)) to indicate interactivity.
- **Overlays (Level 3):** Modals and cart drawers use a deep blur (8px) on the backdrop and a more pronounced shadow to focus attention.

## Shapes
The system utilizes a **Rounded** (Level 2) shape language to soften the corporate color palette and make the interface feel approachable. 

The standard border radius for product cards and input fields is 12px. Interactive buttons use 8px or "pill" depending on the context, but the default remains 12px for maximum consistency with the card-based layout.

## Components

### Buttons
- **Primary (CTA):** Background `#F97316`, White text, 12px radius. Features a subtle orange glow shadow on hover. Use for "Add to Cart".
- **Secondary:** Transparent background, `#1E3A8A` border (1.5px), `#1E3A8A` text. Use for "View Details" or "Compare".
- **Ghost:** No border, `#64748B` text. Use for low-priority actions like "Save for Later".

### Cards
Product cards are the core unit. They must include a white container, 12px radius, and a fixed aspect ratio for images (usually 1:1 or 4:5). Price must be clearly separated from the title using the primary brand color or black.

### Inputs & Selects
Inputs use the `neutral_border` with a 12px radius. On focus, the border transitions to `primary_color_hex` with a soft 2px outer glow.

### Badges & Urgency
- **Trust Badge:** Small icon + text using `secondary_color_hex` (Emerald).
- **Stock Status:** "Low Stock" uses `error_color_hex` (Red) text with a light red tint background. 
- **Reviews:** Star ratings always use a specific Gold (`#FACC15`) to stand out against the blue/orange palette.

### Navigation
The header should remain sticky, utilizing a white background with a subtle bottom border (`#E2E8F0`) to maintain the card-layering metaphor during scroll.