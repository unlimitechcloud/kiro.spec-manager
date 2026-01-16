#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Clean dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy POWER.md
console.log('Copying POWER.md...');
fs.copyFileSync(
  path.join(__dirname, 'POWER.md'),
  path.join(distDir, 'POWER.md')
);

// Copy steering directory
console.log('Copying steering files...');
const steeringDir = path.join(__dirname, 'steering');
const distSteeringDir = path.join(distDir, 'steering');
fs.mkdirSync(distSteeringDir, { recursive: true });

const steeringFiles = fs.readdirSync(steeringDir);
steeringFiles.forEach(file => {
  if (file.endsWith('.md')) {
    console.log(`  - ${file}`);
    fs.copyFileSync(
      path.join(steeringDir, file),
      path.join(distSteeringDir, file)
    );
  }
});

// Copy documentation files
console.log('Copying documentation files...');
const docFiles = [
  'README.md',
  'spec-manager-schema.md',
  'metadata-schema.md'
];

docFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  if (fs.existsSync(sourcePath)) {
    console.log(`  - ${file}`);
    fs.copyFileSync(sourcePath, path.join(distDir, file));
  }
});

console.log('\n✅ Build complete! Power files are in dist/\n');
console.log('Allowed files in power:');
console.log('  - POWER.md');
console.log('  - steering/*.md');
console.log('  - README.md (documentation)');
console.log('  - *.md (documentation files)');
