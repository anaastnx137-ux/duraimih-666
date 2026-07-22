const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const outputDir = path.join(sourceDir, 'dist');
const excludedNames = new Set([
  'dist',
  'node_modules',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'build-static.js'
]);

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (excludedNames.has(entry.name)) continue;

    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDirectory(sourceDir, outputDir);
console.log(`Frontend static build created at ${outputDir}`);
