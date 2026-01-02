# Vite React Starter

A modern, lightweight React starter template with Vite, TypeScript, TailwindCSS, and optional testing frameworks.

## Features

### Core (Always Included)
- ⚡️ [Vite](https://vitejs.dev/) - Lightning fast build tool
- ⚛️ [React 19](https://react.dev/) - Latest React with concurrent features
- 🔷 [TypeScript](https://www.typescriptlang.org/) - Type safety
- 🎨 [TailwindCSS 4](https://tailwindcss.com/) - Utility-first CSS
- 🚦 [React Router 7](https://reactrouter.com/) - Client-side routing
- 📏 [ESLint](https://eslint.org/) - Code linting
- 🔄 [Semantic Release](https://semantic-release.gitbook.io/) - Automated versioning

### Optional Features
- 🧪 **Vitest** - Fast unit testing framework with React Testing Library
- 🎭 **Playwright** - Reliable end-to-end testing framework

## Getting Started

### Using this template

1. Click "Use this template" on GitHub to create your own repository
2. Clone your new repository
3. Run the setup script to configure optional features:

```bash
npm install
node setup.js
```

The setup script will ask you which optional features you want to install:
- **Vitest**: For unit and component testing
- **Playwright**: For end-to-end browser testing

### Manual setup (skip setup script)

If you prefer to start with the minimal setup:

```bash
npm install
npm run dev
```

You can always run `node setup.js` later to add optional features.

## Available Scripts

### Core Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing Scripts (if enabled)

**Vitest:**
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

**Playwright:**
- `npm run test:e2e` - Run e2e tests
- `npm run test:e2e:ui` - Run e2e tests with UI
- `npm run test:e2e:debug` - Debug e2e tests

> **Note:** For Playwright, run `npx playwright install` after setup to install browsers.

## Project Structure

```
├── src/
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles
│   ├── test/                # Test setup (if Vitest enabled)
│   └── assets/              # Static assets
├── e2e/                     # E2E tests (if Playwright enabled)
├── public/                  # Public static files
├── .github/
│   └── workflows/           # CI/CD workflows
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration (if enabled)
├── playwright.config.ts     # Playwright configuration (if enabled)
├── tsconfig.json            # TypeScript configuration
└── eslint.config.js         # ESLint configuration
```

## Versioning

This template uses [semantic-release](https://semantic-release.gitbook.io/) for automated versioning. See [VERSIONING.md](./VERSIONING.md) for details.

**Commit message format:**
- `feat:` - New feature (bumps minor version)
- `fix:` - Bug fix (bumps patch version)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (bumps major version)

## Removing Features

If you want to remove a feature after installing it:

1. **Remove dependencies** from `package.json`
2. **Remove scripts** from `package.json`
3. **Delete configuration files** (e.g., `vitest.config.ts`, `playwright.config.ts`)
4. **Delete test directories** (e.g., `src/test/`, `e2e/`)
5. Run `npm install` to clean up

## Contributing

This is a template repository. Feel free to customize it for your needs!

## License

MIT
