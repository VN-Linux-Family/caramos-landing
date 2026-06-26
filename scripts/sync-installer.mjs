import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const landingDir = resolve(scriptDir, '..');
const initCwd = process.env.INIT_CWD ? resolve(process.env.INIT_CWD) : landingDir;

const candidates = [
  process.env.CARAMOS_INSTALLER_SOURCE,
  resolve(initCwd, '..', 'install-caramos-ota.sh'),
  resolve(landingDir, '..', 'install-caramos-ota.sh'),
  resolve(landingDir, '..', 'CaramOS', 'install-caramos-ota.sh'),
].filter(Boolean);

const source = candidates.find((candidate) => {
  try {
    return existsSync(candidate) && statSync(candidate).isFile();
  } catch {
    return false;
  }
});

if (!source) {
  console.error('Cannot find install-caramos-ota.sh. Tried:');
  for (const candidate of candidates) {
    console.error(`- ${candidate}`);
  }
  console.error('Set CARAMOS_INSTALLER_SOURCE=/absolute/path/install-caramos-ota.sh if needed.');
  process.exit(1);
}

const target = resolve(landingDir, 'public', 'install-caramos-ota.sh');
mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`Synced ${source} -> ${target}`);
