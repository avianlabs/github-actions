import { execSync } from 'node:child_process';
import path from 'node:path';

export function getDirs() {
  const homeDir = readInput('home-directory').trim();
  if (!homeDir) {
    throw new Error('Input "home-directory" is required');
  }

  const pathToCache = readInput('path').trim();
  if (!pathToCache) {
    throw new Error('Input "path" is required');
  }
  
  const repo = process.env.GITHUB_REPOSITORY;
  const cacheDir = path.join(homeDir, 'selfhosted-cache', repo, pathToCache);
  const targetDir = path.join(gw, pathToCache);

  return { cacheDir, targetDir };
}

export function readInput(name) {
  // GH normalizes both dash and underscore forms
  const key = 'INPUT_' + name.toUpperCase().replace(/ /g, '_');
  const dashKey = key.replace(/_/g, '-');
  return process.env[key] || process.env[dashKey] || '';
}

export function runBash(cmd) {
  execSync(cmd, { stdio: 'inherit', shell: '/bin/bash' });
}
