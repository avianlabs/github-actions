import { execSync } from 'node:child_process';
import path from 'node:path';

export function getDirs() {
    const repo = process.env.GITHUB_REPOSITORY;         // owner/repo
    const gw = process.env.GITHUB_WORKSPACE;            // e.g. /home/runner/_work/repo/repo
    const repoRoot = path.dirname(gw);                  // e.g. /home/runner/_work/repo
    let pathToCache = readInput('path').trim();

    const cacheDir = path.join(repoRoot, '_caches', repo, pathToCache);
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
