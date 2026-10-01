// scripts/sync-version.js
/**
 * @packageDocumentation
 * 
 * Updates the version in `package.json` from `git tag`.
 * 
 * Set as prebuild in `package.json`
 * 
 * ``` json
 *  * "scripts": {
 *     "prebuild": "node <scriptsdir>/sync-version.js",
 *     "build": "vite build"
 *   ...
 * }
 * ```
 * 
 */


import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'node:process';

/**
 * Synchronize package.json version with the latest git tag.
 */
function updateVersionFromGit() {
  try {
    // Get the latest git tag (e.g., v1.2.3 or 1.2.3)
    const tag = execSync('git describe --tags --abbrev=0').toString().trim();
    const version = tag.startsWith('v') ? tag.slice(1) : tag;

    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    if (pkgData.version !== version) {
      pkgData.version = version;
      fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2) + '\n');
      console.log(`[sync-version] Updated package.json version to: ${version}`);
    } else {
      console.log(`[sync-version] Version is already up to date: ${version}`);
    }
  } catch (err) {
    console.warn('[sync-version] Could not read git tag, keeping package.json as is:', err.message);
  }
}

updateVersionFromGit();