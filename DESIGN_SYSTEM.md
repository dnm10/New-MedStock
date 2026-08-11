# MedStock Design System

This document outlines the unified design system for the MedStock application. All frontend components should use these Tailwind-based primitives rather than custom CSS modules.

## Colors

### Clinical Blue (Primary)
The primary brand color used for key actions, headers, and active states.
- `bg-primary-50` to `bg-primary-900`
- Base: `primary-500` (#3b82f6)
- Hover: `primary-600` (#2563eb)
- Deep/Headers: `primary-800` (#1e40af)

### Medical Teal (Secondary)
Secondary brand color used for accents and secondary actions.
- `bg-secondary-50` to `bg-secondary-900`

### Semantic States
Used for status indicators, badges, and alerts.
- **Success (Emerald)**: `success`, `success-hover`, `success-bg`, `success-text` (for delivered orders, high stock)
- **Warning (Amber)**: `warning`, `warning-hover`, `warning-bg`, `warning-text` (for low stock, pending)
- **Danger (Red)**: `danger`, `danger-hover`, `danger-bg`, `danger-text` (for destructive actions, expired stock)

### Slate (Neutrals)
Professional grays used for text, borders, and backgrounds.
- Backgrounds: `slate-50` (page background), `slate-100` (hover states)
- Borders: `slate-200`
- Text (Muted): `slate-500`
- Text (Body): `slate-700`
- Text (Headings): `slate-800`

## Typography

- **Font Family**: Inter (`font-sans`)
- **Page Headings**: `text-2xl font-bold text-slate-800`
- **Card Titles**: `text-lg font-semibold text-slate-800`
- **Body**: `text-sm text-slate-700`

## Shadows

- **Cards**: `shadow-card` (Subtle depth)
- **Cards (Hover)**: `shadow-card-hover` (Elevated on interaction)
- **Modals**: `shadow-modal` (Deep shadow for focus)

## Common Components (Tailwind Classes)

### Buttons
- **Primary**: `bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm`
- **Secondary**: `bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm`
- **Danger**: `bg-danger hover:bg-danger-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm`

### Inputs
- **Base**: `w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-700 placeholder-slate-400 transition-shadow`

### Cards
- **Base**: `bg-white rounded-xl shadow-card border border-slate-100 p-6`

### Modals
- **Backdrop**: `fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4`
- **Container**: `bg-white rounded-2xl shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto`

### Tables
- **Container**: `bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden`
- **Header (`th`)**: `bg-slate-50 px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200`
- **Row (`tr`)**: `hover:bg-slate-50 transition-colors`
- **Cell (`td`)**: `px-6 py-4 whitespace-nowrap text-sm text-slate-700 border-b border-slate-100`
