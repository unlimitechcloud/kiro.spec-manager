#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Create dist directory
fs.mkdirSync('dist', { recursive: true });

// Copy POWER.md
console.log('Copying POWER.md...');
fs.copyFileSync('POWER.md', 'dist/POWER.md');

// Copy steering directory
console.log('Copying steering files...');
fs.mkdirSync('dist/steering', { recursive: true });

const steeringFiles = fs.readdirSync('steering').filter(f => f.endsWith('.md'));
steeringFiles.forEach(file => {
  fs.copyFileSync(
    path.join('steering', file),
    path.join('dist', 'steering', file)
  );
  console.log(`  - ${file}`);
});

// Copy additional markdown files that are part of the documentation
console.log('Copying documentation files...');
const docFiles = [
  'README.md',
  'spec-manager-schema.md',
  'metadata-schema.md'
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('dist', file));
    console.log(`  - ${file}`);
  }
});

console.log('\n✅ Build complete! Power files are in dist/');
console.log('\nAllowed files in power:');
console.log('  - POWER.md');
console.log('  - steering/*.md');
console.log('  - README.md (documentation)');
console.log('  - *.md (documentation files)');
