const { pitchClasses } = require('./pitchClasses');
const { writeFileSync } = require('fs');
const MidiWriter = require('midi-writer-js');
const path = require('path');
const {
  Chord,
  Progression,
  Note,
} = require('@tonaljs/tonal');

// convert (x,y) to d
const xy2d = (n, x, y) => {
  let rx, ry, s, d = 0;
  for (s = n / 2; s > 0; s /= 2) {
    rx = (x & s) > 0;
    ry = (y & s) > 0;
    d += s * s * ((3 * rx) ^ ry);
    
    const [ rotX, rotY ] = rot(n, x, y, rx, ry);
    x = rotX;
    y = rotY;
  }

  return d;
};

// convert d to (x,y)
const d2xy = (n, d) => {
  let rx = 0;
  let ry = 0;
  let s = 0;
  let t = d;
  let x = 0;
  let y = 0;

  for (s = 1; s < n; s *= 2) {
    rx = 1 & (t / 2);
    ry = 1 & (t ^ rx);

    const [ rotX, rotY ] = rot(s, x, y, rx, ry);
    x = rotX;
    y = rotY;

    x += s * rx;
    y += s * ry;
    t /= 4;
  }

  return [ x, y ];
};

// rotate/flip a quadrant appropriately
const rot = (n, x, y, rx, ry) => {
  let t = 0;
  if (!ry) {
    if (rx) {
      x = n - 1 - x;
      y = n - 1 - y;
    }

    // Swap x and y
    t = x;
    x = y;
    y = t;
  }

  return [ x, y ];
};

const tonics = [
  'C',  // major
  'A',  // minor
  'G',  // major
  'E',  // minor
  'D',  // major
  'B',  // minor
  'A',  // major
  'F#', // minor
  'E',  // major
  'C#', // minor
  'B',  // major
  'Gb', // minor
  'F#', // major
  'D#', // minor
  'Db', // major
  'Bb', // minor
  'Ab', // major
  'F',  // minor
  'Eb', // major
  'C',  // minor
  'Bb', // major
  'G',  // minor
  'F',  // major
  'D',  // minor
];

const chordProgressions = [
  [ 'I', 'IV', 'V', 'I', 'I', 'vi', 'IV', 'V' ],
  [ 'I', 'vi', 'IV', 'V', 'ii', 'V', 'I', 'ii' ],
  [ 'ii', 'V', 'I', 'ii', 'I', 'vi', 'ii', 'V' ],
  [ 'I', 'vi', 'ii', 'V', 'I', 'vi', 'ii', 'V' ],
  [ 'I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV' ],
  [ 'I', 'IV', 'vi', 'V', 'I', 'IV', 'vi', 'V'  ],
  [ 'I', 'iii', 'IV', 'V', 'I', 'iii', 'IV', 'V' ],
  [ 'I', 'IV', 'I', 'V', 'I', 'IV', 'ii', 'V' ],

  [ 'I', 'IV', 'V', 'I', 'I', 'vi', 'IV', 'V' ].reverse(),
  [ 'I', 'vi', 'IV', 'V', 'ii', 'V', 'I', 'ii' ].reverse(),
  [ 'ii', 'V', 'I', 'ii', 'I', 'vi', 'ii', 'V' ].reverse(),
  [ 'I', 'vi', 'ii', 'V', 'I', 'vi', 'ii', 'V' ].reverse(),
  [ 'I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV' ].reverse(),
  [ 'I', 'IV', 'vi', 'V', 'I', 'IV', 'vi', 'V'  ].reverse(),
  [ 'I', 'iii', 'IV', 'V', 'I', 'iii', 'IV', 'V' ].reverse(),
  [ 'I', 'IV', 'I', 'V', 'I', 'IV', 'ii', 'V' ].reverse(),

  [ 'I', 'IV', 'V', 'I', 'I', 'vi', 'IV', 'V' ],
  [ 'I', 'vi', 'IV', 'V', 'ii', 'V', 'I', 'ii' ],
  [ 'ii', 'V', 'I', 'ii', 'I', 'vi', 'ii', 'V' ],
  [ 'I', 'vi', 'ii', 'V', 'I', 'vi', 'ii', 'V' ],
  [ 'I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV' ],
  [ 'I', 'IV', 'vi', 'V', 'I', 'IV', 'vi', 'V'  ],
  [ 'I', 'iii', 'IV', 'V', 'I', 'iii', 'IV', 'V' ],
  [ 'I', 'IV', 'I', 'V', 'I', 'IV', 'ii', 'V' ],
];

// Start with a new track
const track = new MidiWriter.Track();

// Melody
track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

const matrixSize = 16;
const tonicsRand = Math.max(0, Math.floor(Math.random() * (tonics.length - matrixSize)));
const selectedTonics = tonics.slice(tonicsRand);
const chordProgsRand = Math.max(0, Math.floor(Math.random() * (chordProgressions.length - matrixSize)));
const selectedChordProgs = chordProgressions.slice(chordProgsRand);
const pitchNumRand = Math.floor(Math.random() * 16);
const selectedPitchNums = Object.keys(pitchClasses).slice(pitchNumRand, pitchNumRand + matrixSize);

console.log(selectedTonics, selectedChordProgs, selectedPitchNums);

// all notes quarter notes for now
const duration = '4';

for (let ii = 0; ii < Math.pow(matrixSize, 2); ii += 1) {
  const [ x, y ] = d2xy(matrixSize, ii);

  const tonic = notesMatrix[x];
  const romans = matrix[1][y];
  const progression = Progression.fromRomanNumerals(
    tonic,
    romans,
  );

  for (let ii = 0; ii < progression.length; ii += 1) {
    const type = /A-Z/.test(romans[ii][0]) ? 'major' : 'minor';
    const melodyChord = Chord.getChord(type, `${tonic}4`, progression[ii]);
    const bassChord = Chord.getChord(type, `${tonic}3`, progression[ii]);

    const pitch = [
      ...melodyChord.notes,
      ...bassChord.notes,
    ];

    const midiNote = new MidiWriter.NoteEvent({
      pitch,
      duration,
    });

    track.addEvent(midiNote);
  }
}

// Generate a data URI
const writer = new MidiWriter.Writer(track);
writeFileSync(path.join(__dirname, '..', 'hilbert.mid'), writer.buildFile());