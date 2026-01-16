# Build Instructions

This repository contains the source files for the Spec Manager Power. The power must be built before distribution.

## Structure

- **Source files**: Root directory (includes development files, specs, examples)
- **Distribution files**: `dist/` directory (only files allowed in Kiro powers)

## Building

```bash
npm run build
```

This will:
1. Clean the `dist/` directory
2. Copy `POWER.md` to `dist/`
3. Copy all `steering/*.md` files to `dist/steering/`
4. Copy documentation files (`README.md`, `spec-manager-schema.md`, `metadata-schema.md`)

## What Gets Included

Powers can only contain:
- `POWER.md` (required)
- `steering/*.md` (optional)
- `*.md` documentation files

## What Gets Excluded

The following are excluded from distribution:
- `.kiro/` directory (development specs)
- `example-*.json` files (development examples)
- `package.json`, `build.js` (build tools)
- Any other non-markdown files

## Distribution

After building, the `dist/` directory contains the complete power ready for distribution.

To install from the dist directory:
1. Build the power: `npm run build`
2. In Kiro, use the local directory path: `/path/to/repo/dist`

## Publishing

For GitHub distribution, push the `dist/` contents to a separate branch or use GitHub Actions to automatically build and publish.
