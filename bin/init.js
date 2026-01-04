#!/usr/bin/env node

import fs from 'fs';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';

const packageJsonPath = './package.json';
const git = simpleGit();

async function getGitRepoName() {
  try {
    const config = await git.getConfig('remote.origin.url');
    const remoteUrl = config.value;
    
    if (remoteUrl) {
      const repoName = remoteUrl.split('/').pop().replace('.git', '');
      return repoName || 'my-app';
    }
  } catch (error) {
    console.warn('Could not get git repo name, using default.');
  }
  return 'my-app';
}

async function getGitRemoteUrl() {
  try {
    const config = await git.getConfig('remote.origin.url');
    return config.value || '';
  } catch (error) {
    return '';
  }
}

async function main() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const defaultName = await getGitRepoName();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: defaultName,
      validate: (input) => {
        if (!input) return 'Name is required';
        if (!/^[a-z0-9\-_]+$/.test(input)) return 'Name should be lowercase with no spaces or special chars';
        return true;
      }
    }
  ]);

  // Update package.json
  packageJson.name = answers.name;
  packageJson.description = '';
  packageJson.author = '';
  packageJson.version = '1.0.0';
  const repoUrl = await getGitRemoteUrl();
  if (repoUrl) {
    packageJson.repository = {
      type: 'git',
      url: repoUrl
    };
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  console.log('✅ package.json updated successfully!');
  console.log('You can now run `npm install` to install dependencies.');
}

main().catch(console.error);