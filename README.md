# Kyiv Rental

**Київська оренда** is a Ukrainian-language interactive visual novel about
three friends searching for an apartment in Kyiv. The game includes branching
choices, relationship and stress values, a limited budget, local save data,
and nine possible endings.

The application is built with React, TypeScript, and Vite. It runs entirely in
the browser and does not require a backend or database.

## Requirements

- Node.js `20.19` or newer, or Node.js `22.12` or newer
- npm

## Local development

Clone or download the repository, open a terminal in the project directory,
and install the dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, normally
`http://localhost:5173`. Vite automatically reloads the page when source files
change.

Game progress is stored in the browser's `localStorage`. Clearing site data or
using **Почати спочатку** removes the current saved run.

## Production build

Create an optimized production build:

```bash
npm run build
```

The generated files are written to `dist/`. Preview that build locally with:

```bash
npm run preview
```

Open the preview URL printed in the terminal.
