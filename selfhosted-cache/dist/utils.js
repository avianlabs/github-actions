import { execSync } from 'node:child_process';
import path from 'node:path';

export function withDirs(func) {
  const cacheDirBase = readInput('cache-dir').trim();
  if (!cacheDirBase) {
    throw new Error('Input "cache-dir" is required');
  }

  const pathToCache = readInput('path').trim();
  if (!pathToCache) {
    throw new Error('Input "path" is required');
  }
  
  // Split paths by newlines and filter out empty lines
  const paths = pathToCache.split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  if (paths.length === 0) {
    throw new Error('At least one path must be provided');
  }
  
  const gw = process.env.GITHUB_WORKSPACE;
  const repo = process.env.GITHUB_REPOSITORY;
  const lockFile = path.join(cacheDirBase, repo, '.lock');
  
  // Call the function for each path
  for (const pathName of paths) {
    const cacheDir = path.join(cacheDirBase, repo, pathName);
    const targetDir = path.join(gw, pathName);
    
    func({ cacheDir, targetDir, lockFile, pathName });
  }
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
