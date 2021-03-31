import {
  majorKeyBlueBoxes,
} from '../BlockChords/chordMap';
import {
  Chord,
  Interval,
  Note,
  Scale,
} from '@tonaljs/tonal';

export const getFirstBlockChord = (tonic, type = 'major') => {
  const blockChord = majorKeyBlueBoxes[majorKeyBlueBoxes.length - 1][0];
  return {
    tonic,
    ...blockChord,
    notes: [ ...Chord.get([ tonic, type ]).notes ],
  };
};

export const getNextMajorBlockChord = (
  lastChord,
  color = 'blue',
) => {
  const [
    x,
    y,
  ] = lastChord.mapPosition;

  const tonicKey = lastChord.tonic.slice(0, -1);
  const tonicOctave = lastChord.tonic[lastChord.tonic.length - 1];

  let newChord = null;
  let extension = null;
  if (color === 'blue') {
    const blockChord = lastChord;
    const roll = Math.random();
    let total = roll;
    let nextMove = 'down';
    for (const [ k, v ] of Object.entries(blockChord.chances)) {
      if (k !== 'blue' && k !== 'green') {
        total -= v;
      }

      if (total <= 0) {
        nextMove = k;
        break;
      }
    }

    if (nextMove === 'up') {
      let boundedY = y - 1;
      if (boundedY < 0) {
        boundedY = majorKeyBlueBoxes.length - Math.abs(boundedY);
      }

      const up = majorKeyBlueBoxes[boundedY];
      newChord = up[Math.floor(Math.random() * up.length)];
    } else if (nextMove === 'down') {
      const boundedY = y + 1 >= majorKeyBlueBoxes.length ? (y + 1) % majorKeyBlueBoxes.length : y + 1;
      const down = majorKeyBlueBoxes[boundedY];
      newChord = down[Math.floor(Math.random() * down.length)];
    } else if (nextMove === 'extend') {
      newChord = blockChord;
      extension = blockChord.extendedChords[Math.floor(Math.random() * blockChord.extendedChords.length)];
    }
  } else {
    newChord = majorKeyBlueBoxes[y][Math.min(x)];
  }

  if (!newChord) {
    throw new Error('Invalid input to getNextMajorBlockChord.');
  }

  const {
    scalePosition,
    modulations,
  } = newChord;

  const isMinor = modulations.indexOf('m') !== -1;
  const scaleType = `${tonicKey}${tonicOctave} ${isMinor ? 'minor' : 'major'}`;
  let chordRoot = Scale.get(scaleType).notes[scalePosition];

  let semitoneChange = 0;
  semitoneChange += modulations.indexOf('#') !== -1;
  semitoneChange -= modulations.indexOf('b') !== -1;
  const changeInterval = Interval.fromSemitones(semitoneChange);

  chordRoot = Note.transpose(chordRoot, changeInterval);

  // TODO: handle extension modulation here or in the calling function.

  if (extension) {
    if (extension === '2') {
      extension = 'add2';
    } else if (extension === 'sus') {
      extension = Math.random() > 0.5 ? 'sus2' : 'sus4';
    } else if (extension === '6') {
      extension = `${isMinor ? 'minor ' : ''}sixth`;
    } else if (extension === '7') {
      extension = `${isMinor ? 'minor' : 'major'} seventh`;
    } else if (extension === 'm7') {
      extension = 'minor seventh';
    } else if (extension === 'M7') {
      extension = 'major seventh';
    } else if (extension === 'M9') {
      extension = 'major ninth';
    } else if (extension === 'm9') {
      extension = 'minor ninth';
    } else if (extension === 'b9') {
      extension = 'dominant flat ninth';
    } else if (extension === '11') {
      extension = `${isMinor ? 'minor ' : ''}eleventh`;
    } else if (extension === '13') {
      extension = `${isMinor ? 'minor' : 'major'} thirteenth`;
    }

    return {
      tonic: tonicKey + tonicOctave,
      ...newChord,
      notes: [ ...Chord.get([ chordRoot, extension ]).notes ],
    };
  } if (isMinor) {
    return {
      tonic: tonicKey + tonicOctave,
      ...newChord,
      notes: [ ...Chord.get([ chordRoot, 'minor' ]).notes ],
    };
  }
  
  return {
    tonic: tonicKey + tonicOctave,
    ...newChord,
    notes: [ ...Chord.get([ chordRoot, 'major' ]).notes ],
  };
};

export const getNextMinorBlockChord = (
  lastChord,
  color = 'blue',
) => {
  const [
    x,
    y,
  ] = lastChord.mapPosition;

  const tonicKey = lastChord.tonic.slice(0, -1);
  const tonicOctave = lastChord.tonic[lastChord.tonic.length - 1];

  let newChord = null;
  let extension = null;
  if (color === 'blue') {
    const blockChord = lastChord;
    const roll = Math.random();
    let total = roll;
    let nextMove = 'down';
    for (const [ k, v ] of Object.entries(blockChord.chances)) {
      if (k !== 'blue' && k !== 'green') {
        total -= v;
      }

      if (total <= 0) {
        nextMove = k;
        break;
      }
    }

    if (nextMove === 'up') {
      let boundedY = y - 1;
      if (boundedY < 0) {
        boundedY = minorKeyBlueBoxes.length - Math.abs(boundedY);
      }

      const up = minorKeyBlueBoxes[boundedY];
      newChord = up[Math.floor(Math.random() * up.length)];
    } else if (nextMove === 'down') {
      const boundedY = y + 1 >= minorKeyBlueBoxes.length ? (y + 1) % minorKeyBlueBoxes.length : y + 1;
      const down = minorKeyBlueBoxes[boundedY];
      newChord = down[Math.floor(Math.random() * down.length)];
    } else if (nextMove === 'extend') {
      newChord = blockChord;
      extension = blockChord.extendedChords[Math.floor(Math.random() * blockChord.extendedChords.length)];
    }
  } else {
    newChord = minorKeyBlueBoxes[y][Math.min(x)];
  }

  if (!newChord) {
    throw new Error('Invalid input to getNextMajorBlockChord.');
  }

  const {
    scalePosition,
    modulations,
  } = newChord;

  const isMajor = modulations.indexOf('m') !== -1;
  const scaleType = `${tonicKey}${tonicOctave} ${isMajor ? 'major' : 'minor'}`;
  let chordRoot = Scale.get(scaleType).notes[scalePosition];

  let semitoneChange = 0;
  semitoneChange += modulations.indexOf('#') !== -1;
  semitoneChange -= modulations.indexOf('b') !== -1;
  const changeInterval = Interval.fromSemitones(semitoneChange);

  chordRoot = Note.transpose(chordRoot, changeInterval);

  // TODO: handle extension modulation here or in the calling function.

  if (extension) {
    if (extension === '2') {
      extension = 'add2';
    } else if (extension === 'sus') {
      extension = Math.random() > 0.5 ? 'sus2' : 'sus4';
    } else if (extension === '6') {
      extension = `${isMajor ? '' : 'minor '}sixth`;
    } else if (extension === '7') {
      extension = `${isMajor ? 'major' : 'minor'} seventh`;
    } else if (extension === 'm7') {
      extension = 'minor seventh';
    } else if (extension === 'M7') {
      extension = 'major seventh';
    } else if (extension === 'M9') {
      extension = 'major ninth';
    } else if (extension === 'm9') {
      extension = 'minor ninth';
    } else if (extension === 'b9') {
      extension = 'dominant flat ninth';
    } else if (extension === '11') {
      extension = `${isMajor ? '' : 'minor '}eleventh`;
    } else if (extension === '13') {
      extension = `${isMajor ? 'major' : 'minor'} thirteenth`;
    }

    return {
      tonic: tonicKey + tonicOctave,
      ...newChord,
      notes: [ ...Chord.get([ chordRoot, extension ]).notes ],
    };
  } if (isMajor) {
    return {
      tonic: tonicKey + tonicOctave,
      ...newChord,
      notes: [ ...Chord.get([ chordRoot, 'major' ]).notes ],
    };
  }
  
  return {
    tonic: tonicKey + tonicOctave,
    ...newChord,
    notes: [ ...Chord.get([ chordRoot, 'minor' ]).notes ],
  };
};
