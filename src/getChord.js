import {
  enharmonicEquivalents,
  twelveTones,
} from "./notes";

export const getChord = ({
  input,
  root,
  octave = 4,
  minorMajor,
  notes,
}) => {
  const chord = [];

  chord.push(getMelodyRoot({
    root,
    octave,
    notes,
  }));

  chord.push(getMelodyFirstOvertone({
    root,
    octave,
    minorMajor,
    notes,
  }));

  chord.push(getMelodySecondOvertone({
    root,
    octave,
    minorMajor,
    notes,
  }));

  chord.push(getMelodyThirdOvertone({
    root,
    octave,
    minorMajor,
    notes,
  }));

  return chord;
};

export const getMelodyRoot = ({
  root,
  octave,
  notes,
}) => {
  if (root in notes) {
    return notes[root][octave];
  }

  return notes[enharmonicEquivalents[root]][octave];
};

export const getMelodyFirstOvertone = ({
  root,
  octave,
  notes,
  minorMajor,
}) => {
  const distance = minorMajor === 'minor' ? 3 : 4;
  const idx = twelveTones.indexOf(root);
  if (idx + distance >= twelveTones.length) {
    return notes[getOvertone(root, distance)][octave + 1];
  }

  return notes[getOvertone(root, distance)][octave];
};

export const getMelodySecondOvertone = ({
  root,
  octave,
  notes,
}) => {
  // Always a perfect fifth.
  const distance = 7;
  const idx = twelveTones.indexOf(root);
  if (idx + distance >= twelveTones.length) {
    return notes[getOvertone(root, distance)][octave + 1];
  }

  return notes[getOvertone(root, distance)][octave];
};

export const getMelodyThirdOvertone = ({
  root,
  octave,
  notes,
  minorMajor,
}) => {
  const distance = minorMajor === 'minor' ? 8 : 9;
  const idx = twelveTones.indexOf(root);
  if (idx + distance >= twelveTones.length) {
    return notes[getOvertone(root, distance)][octave + 1];
  }

  return notes[getOvertone(root, distance)][octave];
};

export const getKey = (input, randIdx) => {
  return twelveTones[randIdx];
};

export const getChordSize = (input, rand) => {
  if (rand <= 0.33) {
    return 2;
  } else if (rand > 0.33 && rand <= 0.9) {
    return 3;
  }

  return 4;
};

// Must be a pure function.
export const getMinorMajor = (input, rand) => {
  if (input) {
    if (rand && rand > 0.125) {
      return 'minor';
    }
  
    return 'major';
  }

  if (rand && rand > 0.875) {
    return 'minor';
  }

  return 'major';
};

const getOvertone = (root, distance) => {
  return twelveTones[(distance + twelveTones.indexOf(root)) % twelveTones.length];
};
