import { getDirs, runBash } from './utils.js';

(function run() {
  try {
    const eventName = process.env.GITHUB_EVENT_NAME || '';
    if (eventName !== 'pull_request') {
      console.log(`Skipped restoring from cache. event=${eventName}`);
      return;
    }

    const { cacheDir, targetDir } = getDirs();

    runBash(`mkdir -p "${targetDir}"`);
    runBash(`
      if [ -d "${cacheDir}" ]; then
        rsync -a "${cacheDir}/" "${targetDir}/"
        echo "Restored from cache"
        echo "Cache dir: ${cacheDir}"
        echo "Target dir: ${targetDir}"
      else
        echo "No cache at ${cacheDir}"
      fi
    `);
  } catch (err) {
    console.warn(`failed to restore cache: ${err.message || err}`);
  }
})();
