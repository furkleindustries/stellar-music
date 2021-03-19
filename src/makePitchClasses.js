const pcSet = require('@tonaljs/tonal').Pcset;

console.log('export const pitchClasses = {');

// Skip 4096, too complicated
for (let ii = 1; ii < 4095; ii += 1) {
  const set = pcSet.get(ii);
  if (set.normalized !== 'NaN' && set.intervals.length && set.setNum) {
    console.log(`  "${set.setNum}": "${set.chroma}",`);
  }
}

console.log('};\n');
