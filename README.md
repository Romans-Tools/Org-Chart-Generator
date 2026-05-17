# Org Chart Generator

A lightweight, browser-based **Chain of Command / Org Chart Builder** for creating polished organization charts for CAP units, events, and teams.

## Features

- Build and edit org charts with a live visual preview.
- Add, edit, and delete personnel with:
  - Name
  - Rank/grade
  - Duty position/title
  - Section/department
  - Contact details (email and phone)
- Assign supervisor relationships and validate structure.
- Drag-and-drop node re-parenting in the preview.
- Add manual cross-links between nodes.
- Apply starter templates:
  - Squadron Staff
  - Encampment Staff
  - Conference Committee
  - Cadet Staff
  - Incident Command Staff
- Export chart as:
  - SVG
  - PNG
  - Print-to-PDF
- Save/load full chart data as JSON.
- Import personnel from CSV or Excel (`.xlsx`, `.xls`).
- Toggle UI modes:
  - Dark theme
  - Presentation mode
  - Print mode

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- [SheetJS/xlsx](https://github.com/SheetJS/sheetjs) (via CDN) for Excel import

## Getting Started

1. Clone the repository.
2. Open `index.html` in a modern browser.

That’s it—no build step or local server is required for basic usage.

## Data Import Notes

CSV/Excel import recognizes these columns (case-insensitive):

- `name`
- `rank` (or `grade`)
- `position` (or `duty position`, `title`)
- `section` (or `department`, `unit`)
- `email`
- `phone`
- `supervisorName` (or `supervisor`, `reportsTo`)

## Validation Rules

The built-in validation checks for:

- Duplicate names
- Circular supervisor relationships
- Missing root node
- Multiple root nodes (allowed, but flagged for review)
- Broken/missing supervisor references
- Self-supervision
- Span-of-control warnings when a supervisor has more than 7 direct reports (CAP command-structure best-practice signal)

## Project Structure

- `index.html` — app layout and controls
- `style.css` — styling, theme modes, and tree visuals
- `script.js` — app state, editing logic, rendering, import/export, and interactions

## Notes

- This app is fully client-side; no backend or database is required.
- JSON exports include chart metadata, personnel records, and manual links.
