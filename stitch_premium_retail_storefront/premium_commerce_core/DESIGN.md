---
name: Premium Commerce Core
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 60px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is engineered for a premium, single-seller e-commerce experience that balances high-end retail aesthetics with enterprise-grade functional density. The brand personality is professional, reliable, and sophisticated, drawing heavy inspiration from modern minimalist leaders like Apple and Shopify.

The style leverages a **Modern Minimalist** approach with a focus on:
- **Exceptional Whitespace:** Using generous breathing room to elevate product photography and reduce cognitive load.
- **Precision Typography:** A clear hierarchy that guides the user through the conversion funnel without friction.
- **Subtle Depth:** Utilizing soft, ambient shadows and layered surfaces rather than heavy borders to create a structured, professional environment.
- **Functional Clarity:** Every element serves a specific purpose, prioritizing accessibility and ease of use over decorative trends.

## Colors
The palette is built on a foundation of professional blues and deep navies, accented by an amber warmth for high-conversion actions.

- **Primary (#2563EB):** Used for main actions, active states, and primary brand indicators.
- **Secondary (#0F172A):** Provides strong contrast for text, headers, and footer elements, ensuring an "enterprise" weight.
- **Accent (#F59E0B):** Reserved for promotions, star ratings, and subtle "attention-grabbing" badges (e.g., "Limited Edition").
- **Semantic Colors:** Success (#10B981) and Error (#EF4444) are strictly utilized for system feedback and validation states to ensure user confidence.
- **Grayscale:** A refined "Slate" spectrum is used for backgrounds and borders to avoid the harshness of pure black/gray, maintaining a premium feel.

## Typography
The system uses **Inter** exclusively to achieve a clean, systematic, and utilitarian appearance that remains highly readable at all sizes. 

- **Weight Strategy:** Headlines use Semibold (600) and Bold (700) to create clear sections. Body text primarily uses Regular (400), with Medium (500) reserved for interface labels and buttons to ensure WCAG legibility.
- **Optical Adjustments:** Larger display sizes utilize negative letter spacing to feel tighter and more premium.
- **Mobile Scale:** For screen widths below 768px, display and large headline sizes scale down significantly (e.g., 32px becomes 24px) to ensure content remains above the fold.

## Layout & Spacing
The layout follows a **12-column Fixed Grid** model for desktop to maintain a premium "editorial" feel, transitioning to a fluid layout on tablet and mobile.

- **Desktop (1280px+):** 12 columns, 24px gutters, and 64px+ outer margins.
- **Tablet (768px - 1279px):** 8 columns, 24px gutters, 32px outer margins.
- **Mobile (Up to 767px):** 4 columns, 16px gutters, 16px outer margins.
- **Rhythm:** An 8px linear scale (4px, 8px, 16px, 24px, 32px, 48px, 64px) governs all padding and margin decisions, ensuring a consistent mathematical harmony across all components.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Ambient Shadows**. The design avoids harsh lines in favor of soft-edged containers.

- **Level 0 (Base):** #F8FAFC (Slate 50) background for the entire page to make white cards pop.
- **Level 1 (Default Card):** White background (#FFFFFF) with a very soft shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow to indicate interactivity: `0 10px 15px -3px rgba(15, 23, 42, 0.1)`.
- **Level 3 (Modals/Overlays):** Deep, diffused shadows to separate the UI from the background, often accompanied by a 20% opacity backdrop blur (Glassmorphism) for the overlay.

## Shapes
The shape language is **Rounded**, providing a modern, approachable feel while remaining structured enough for enterprise use.

- **Base Components:** Buttons and Input fields use 0.5rem (8px).
- **Large Components:** Product cards and Modals use 1rem (16px).
- **Functional Elements:** Tags, Chips, and Checkboxes use the `rounded-lg` (16px) or full pill-shape where appropriate for distinct visual categorization.

## Components
- **Sticky Navbar:** A blur-background (`backdrop-filter: blur(12px)`) white container with a 1px Slate-200 bottom border. Contains search, account, and cart icons with micro-interactions.
- **Product Cards:** Vertical layout with a 1:1 aspect ratio image. The price is highlighted in Secondary Bold, with the Discount badge in the top-right using Accent Amber. Ratings use small star icons in Accent Amber.
- **Data Tables:** Clean, unbordered rows with 1px Slate-100 horizontal dividers. Header cells use `label-sm` in Secondary Navy for high contrast.
- **Filters:** Sidebar or Horizontal "Pill" style. Active filters use the Primary Blue background with white text.
- **Loading Skeletons:** Smooth pulsing `linear-gradient` from Slate-100 to Slate-200. Skeletons should mirror the exact border-radius of the component they replace.
- **Empty States:** Centered illustrations in muted Slate-400 with a clear Primary action button to "Return to Shop" or "Clear Filters."
- **Form Validation:** Error states use a 1px Error Red border and a small `body-sm` hint text below the input. Focus states for all inputs use a 2px Primary Blue outer ring with 2px offset.