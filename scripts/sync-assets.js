import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(rootAssetsDir)) {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

if (fs.existsSync(distAssetsDir)) {
  const files = fs.readdirSync(distAssetsDir);
  const jsFile = files.find(f => f.endsWith('.js') && !f.endsWith('.map'));
  const cssFile = files.find(f => f.endsWith('.css') && !f.endsWith('.map'));

  if (jsFile) {
    fs.copyFileSync(path.join(distAssetsDir, jsFile), path.join(rootAssetsDir, 'app.js'));
    fs.copyFileSync(path.join(distAssetsDir, jsFile), path.join(distAssetsDir, 'app.js'));
    console.log(`[Sync] Copied ${jsFile} to assets/app.js`);
  }

  if (cssFile) {
    fs.copyFileSync(path.join(distAssetsDir, cssFile), path.join(rootAssetsDir, 'app.css'));
    fs.copyFileSync(path.join(distAssetsDir, cssFile), path.join(distAssetsDir, 'app.css'));
    console.log(`[Sync] Copied ${cssFile} to assets/app.css`);
  }
}
