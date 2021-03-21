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
  console.log(`${tonic}4`)
  return {
    tonic,
    ...blockChord,
    notes: [ ...Chord.get([ `${tonic}4`, 'major' ]).notes ],
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

  const tonic = lastChord.tonic;

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
  const hasSharp = modulations.indexOf('#') !== -1;
  const hasFlat = modulations.indexOf('b') !== -1;

  let note = Scale.get(`${tonic} ${isMinor ? 'minor' : 'major'}`).notes[scalePosition];
  if (hasSharp) {
    note = Note.transpose(note, Interval.fromSemitones(1));
  } else if (hasFlat) {
    note = Note.transpose(note, Interval.fromSemitones(-1));
  }

  // All roots on 4th octave for now 
  note += `4`;

  // Still need to handle extensions here or in the calling function.

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
      extension = `${isMinor ? '' : 'major'} eleventh`;
    } else if (extension === '13') {
      extension = `${isMinor ? 'minor' : 'major'} thirteenth`;
    }

    console.log('extending', extension);
    return {
      tonic,
      ...newChord,
      notes: [ ...Chord.get([ note, extension ]).notes ],
    }    
  } if (isMinor) {
    return {
      tonic,
      ...newChord,
      notes: [ ...Chord.get([ note, 'minor' ]).notes ],
    };
  } else {
    return {
      tonic,
      ...newChord,
      notes: [ ...Chord.get([ note, 'major' ]).notes ],
    };
  }
};
