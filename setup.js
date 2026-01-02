#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { createInterface } from 'readline';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const nonInteractive = args.includes('--all') || args.includes('--vitest') || args.includes('--playwright');

let rl;
if (!nonInteractive) {
  rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

const features = [
  {
    name: 'vitest',
    description: 'Vitest - Unit Testing Framework',
    dependencies: {
      dev: ['vitest', '@vitest/ui', '@testing-library/react', '@testing-library/jest-dom', 'jsdom']
    },
    scripts: {
      'test': 'vitest',
      'test:ui': 'vitest --ui',
      'test:coverage': 'vitest --coverage'
    },
    files: {
      'vitest.config.ts': `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
`,
      'src/test/setup.ts': `import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
`,
      'src/App.test.tsx': `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Bas van Driel')).toBeInTheDocument();
  });
});
`
    }
  },
  {
    name: 'playwright',
    description: 'Playwright - End-to-End Testing Framework',
    dependencies: {
      dev: ['@playwright/test', '@axe-core/playwright']
    },
    scripts: {
      'test:e2e': 'playwright test',
      'test:e2e:ui': 'playwright test --ui',
      'test:e2e:debug': 'playwright test --debug'
    },
    files: {
      'playwright.config.ts': `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
`,
      'e2e/example.spec.ts': `import { test, expect } from '@playwright/test';

test('homepage has expected content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Bas van Driel')).toBeVisible();
});

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  // Basic accessibility check - page should have a title
  await expect(page).toHaveTitle(/Vite/);
});
`
    }
  }
];

async function main() {
  console.log('\n🚀 Welcome to Vite React Starter Setup!\n');
  
  let selectedFeatures = [];
  
  // Handle command line arguments
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node setup.js [options]');
    console.log('\nOptions:');
    console.log('  --all            Install all optional features');
    console.log('  --vitest         Install Vitest (unit testing)');
    console.log('  --playwright     Install Playwright (e2e testing)');
    console.log('  --help, -h       Show this help message');
    console.log('\nInteractive mode:');
    console.log('  Run without arguments to interactively select features\n');
    return;
  }
  
  if (args.includes('--all')) {
    selectedFeatures = [...features];
    console.log('Installing all optional features...\n');
  } else if (args.includes('--vitest') || args.includes('--playwright')) {
    for (const feature of features) {
      if (args.includes(`--${feature.name}`)) {
        selectedFeatures.push(feature);
        console.log(`✓ ${feature.description} will be installed`);
      }
    }
    console.log('');
  } else {
    // Interactive mode
    console.log('This script will help you configure optional features for your project.\n');
    
    for (const feature of features) {
      const answer = await question(`Do you want to install ${feature.description}? (y/N): `);
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        selectedFeatures.push(feature);
        console.log(`✓ ${feature.description} will be installed\n`);
      } else {
        console.log(`✗ ${feature.description} will be skipped\n`);
      }
    }
  }
  
  if (selectedFeatures.length === 0) {
    console.log('\nNo additional features selected. Your project is ready to use!');
    if (rl) rl.close();
    return;
  }
  
  console.log('\n📦 Installing selected features...\n');
  
  // Read package.json
  const packageJsonPath = resolve(__dirname, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  // Add dependencies and scripts
  for (const feature of selectedFeatures) {
    console.log(`\nConfiguring ${feature.description}...`);
    
    // Add dev dependencies
    if (feature.dependencies.dev) {
      packageJson.devDependencies = packageJson.devDependencies || {};
      console.log(`  Adding dev dependencies: ${feature.dependencies.dev.join(', ')}`);
    }
    
    // Add dependencies
    if (feature.dependencies.prod) {
      packageJson.dependencies = packageJson.dependencies || {};
      for (const dep of feature.dependencies.prod) {
        packageJson.dependencies[dep] = 'latest';
      }
    }
    
    // Add scripts
    if (feature.scripts) {
      packageJson.scripts = packageJson.scripts || {};
      Object.assign(packageJson.scripts, feature.scripts);
      console.log(`  Adding scripts: ${Object.keys(feature.scripts).join(', ')}`);
    }
    
    // Create files
    if (feature.files) {
      for (const [filePath, content] of Object.entries(feature.files)) {
        const fullPath = resolve(__dirname, filePath);
        const dir = dirname(fullPath);
        
        // Create directory if it doesn't exist
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        
        writeFileSync(fullPath, content);
        console.log(`  Created: ${filePath}`);
      }
    }
  }
  
  // Write updated package.json
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('\n✓ Updated package.json');
  
  // Install dependencies
  console.log('\n📥 Installing dependencies...');
  const deps = selectedFeatures
    .flatMap(f => f.dependencies.dev || [])
    .join(' ');
  
  if (deps) {
    try {
      execSync(`npm install --save-dev ${deps}`, { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('\n✓ Dependencies installed successfully!');
    } catch (error) {
      console.error('\n✗ Failed to install dependencies. Please run npm install manually.');
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('✨ Setup complete! Features installed:');
  for (const feature of selectedFeatures) {
    console.log(`  - ${feature.description}`);
  }
  console.log('='.repeat(50));
  
  if (selectedFeatures.some(f => f.name === 'vitest')) {
    console.log('\n📝 Vitest commands:');
    console.log('  npm run test          - Run tests');
    console.log('  npm run test:ui       - Run tests with UI');
    console.log('  npm run test:coverage - Run tests with coverage');
  }
  
  if (selectedFeatures.some(f => f.name === 'playwright')) {
    console.log('\n🎭 Playwright commands:');
    console.log('  npm run test:e2e       - Run e2e tests');
    console.log('  npm run test:e2e:ui    - Run e2e tests with UI');
    console.log('  npm run test:e2e:debug - Debug e2e tests');
    console.log('\n  Note: Run "npx playwright install" to install browsers');
  }
  
  console.log('\n🎉 Happy coding!\n');
  
  if (rl) rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  if (rl) rl.close();
  process.exit(1);
});
