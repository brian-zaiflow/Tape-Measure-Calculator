# Tape Measure Calculator

A professional imperial measurement calculator for construction professionals. Perform arithmetic with inches and fractions. Works offline.

![PWA Badge](https://img.shields.io/badge/PWA-Enabled-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Tests](https://img.shields.io/badge/Tests-62%20passing-brightgreen)

## Features

- ➕ **Calculator**: Add, subtract, multiply, divide with inches and fractions
- 📏 **Even Spacing**: Place a set number of items evenly with matching edge offsets
- 🌗 **Dark Mode**: Eye-friendly theme for all lighting conditions
- 📱 **PWA**: Install on mobile, works offline after first load
- ⚡ **Precision**: 1/16" or 1/32" accuracy with automatic fraction reduction
- 🎯 **Quick Fractions**: One-tap buttons for common fractions (1/16 through 15/16)

## Quick Start

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Test
npm test
```

## Usage

### Calculator
1. Enter measurements as whole inches or inch fractions, like `96"` or `30 3/8"`
2. Select operation (+, −, ×, ÷)
3. Enter second measurement
4. Press `=` for result
5. Tap result to toggle between fraction and decimal formats

### Even Spacing
1. Enter the total length of your board, wall, or project area
2. Enter the distance from each end (defaults to `2"`)
3. Enter how many items/marks you need
4. Use the calculated mark positions for hooks, screws, brackets, handles, or layout marks

## Tech Stack

- React 18 + TypeScript 5
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- Vitest (testing)
- PWA with offline support

## Documentation

- **[docs/CLAUDE.md](./docs/CLAUDE.md)** - Developer guide (architecture, deployment, etc.)
- **[docs/QA_TEST_PLAN.md](./docs/QA_TEST_PLAN.md)** - QA testing checklist
- **[docs/design_guidelines.md](./docs/design_guidelines.md)** - Design rationale

## Deployment

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

### PWA Installation

On mobile:
1. Visit the site
2. Tap "Add to Home Screen"
3. Use offline after first load

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- iOS Safari 14+
- PWA requires HTTPS

## License

MIT License

---

Built for construction professionals who need accurate, fast calculations on the job site. 🏗️
