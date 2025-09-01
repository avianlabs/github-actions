import { withDirs, runBash, readInput } from './utils.js';

(function run() {
  try {
    const ref = process.env.GITHUB_REF_NAME || '';  
    let cacheScopeRef = readInput('cache-scope-ref').trim();
    
    console.info(`ref: ${process.env.GITHUB_REF_NAME}`);
    console.info(`cache scope ref: ${cacheScopeRef}`);
    if (ref !== cacheScopeRef) {
      console.log('Skipped updating cache.');
      return;
    }

    withDirs(({ cacheDir, targetDir, lockFile, pathName }) => {
      console.log(`Processing path: ${pathName}`);
      
      runBash(`mkdir -p "${cacheDir}"`);
      runBash(`
        (
          flock -w 30 9 || { echo "Could not acquire cache lock"; exit 1; }
          if [ -d "${targetDir}" ]; then
            rsync -a --delete "${targetDir}/" "${cacheDir}/"
            echo "Updated cache for ${pathName}"
            echo "Cache dir: ${cacheDir}"
            echo "Target dir: ${targetDir}"
          else
            echo "Nothing to cache at: ${targetDir} for ${pathName}"
          fi
        ) 9>"${lockFile}"
      `);
    });
  } catch (err) {
    console.warn(`failed updating cache: ${err.message || err}`);
  }
})();
